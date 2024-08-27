import React, { useEffect, useState } from "react";
import {TouchableOpacity, Alert, Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { Auth } from 'aws-amplify';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';
export default function RotationEventSelection(props) {
	const [spinner, setSpinner] = useState(false);
	const { childCourse, parentCourse, rotationType, rotationList } = props.route.params;
	const [selectedRotation, setSelectedRotation] = useState('');
	const [selectedRotationName, setSelectedRotationName] = useState('');
	const [selectedCompareRotation, setSelectedCompareRotation] = useState('1');
	const [selectedCompareRotationName, setSelectedCompareRotationName] = useState('1');
	const [rotation, setRotation] = useState('');
	const [isCompare, setSelection] = useState(false);

	const [specialRotationList, setSpecialRotationList] = useState();
	const [generalRotationList, setGeneralRotationList] = useState();

	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	

		console.log("Rotation List: ", rotationList);	

		getActiveRotation();
	
	},[]);

	const getActiveRotation = async() => {
		setSpinner(true);
		try {
			const activeRotationInfo =  await VisageFuctionAPI.getActiveRotationAPI(parentCourse, childCourse);
		
		

			if(activeRotationInfo.hasOwnProperty("success")){		
				
				
				const activeRotation = activeRotationInfo['result'];
				console.log("activeRotationInfo", activeRotation);
				
				getRotationList(activeRotation);
				
			} else {
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			}
		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
	}

	const getRotationList = (activeRotation) => {
		if(activeRotation.RotationSetType == 2){
			var tempSpecialRotationList = [];
			var tempSpecialRotationItem = {};
			let selectedNumber = 0;
			const specialRotationList = rotationList[1];
			for(let i = 0; i < specialRotationList.length; i++){

				let rotationNameItem = specialRotationList[i].rotationName;
				console.log("RotaionNameItem: ", rotationNameItem);

				console.log("Active Rotation Marker: ", activeRotation.Marker);
				if(rotationNameItem == activeRotation.Marker){
					selectedNumber = i;
					tempSpecialRotationItem = {
						rotationName: specialRotationList[i].rotationName + " (Active)"
					} 
				} else {
					tempSpecialRotationItem = specialRotationList[i];
				}
				tempSpecialRotationList.push(tempSpecialRotationItem);
			}
			console.log("today/event rotation List: ", tempSpecialRotationList);
			setSpecialRotationList(tempSpecialRotationList);
			setSelectedRotation(selectedNumber);
			setRotation(selectedNumber + 1);
			setSelectedRotationName(tempSpecialRotationList[selectedNumber].rotationName);
		} else {
			console.log(">>>>>>>>>>>>>>>>>>>>>>.")
			setSpecialRotationList(rotationList[1]);
			setSelectedRotation(0);
			setRotation(1);
			setSelectedRotationName(rotationList[1][0].rotationName);
		}

		if(activeRotation.RotationSetType == 1){
			var tempGeneralRotationList = [];
			var tempGeneralRotationItem = {};
			let selectedNumber = 0;
			const generalRotationList = rotationList[0];
			for(let i = 0; i < generalRotationList.length; i++){
				let rotationNameItem = specialRotationList[i].rotationName;
				console.log("RotaionNameItem: ", rotationNameItem);

				console.log("Active Rotation Marker: ", activeRotation.Marker);

				if(rotationNameItem == activeRotation.Marker){
					selectedNumber = i;
					tempGeneralRotationItem = {
						rotationName: generalRotationList[i].rotationName + " (Active)"
					} 
				} else {
					tempGeneralRotationItem = generalRotationList[i];
				}
				tempGeneralRotationList.push(tempGeneralRotationItem);
			}
			console.log("general event rotation List: ", tempGeneralRotationList);
			setSelectedRotation(selectedNumber);
			setRotation(selectedNumber + 1);
			setSelectedRotationName(tempSpecialRotationList[selectedNumber].rotationName);
		} else {
			setGeneralRotationList(rotationList[0]);
			setSelectedCompareRotation(0);
			setSelectedCompareRotationName(rotationList[0].rotationName);
		}
		setSpinner(false);
	}

	const onContinue = () => {

		const compareRotationName = isCompare ? selectedCompareRotation + 1 : 0;
		console.log("selected Rotation: ", rotation);


		console.log("selectedRotationName: ", selectedRotationName);
		props.navigation.navigate('LocationMethod', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation: rotation.toString(),
			compareRotation: compareRotationName.toString(),
			isCompare: isCompare,
			rotationType: rotationType,
			rotationName: selectedRotationName
		});	
		
	}

	const selectPicker = (value, index) => {
		setSelectedRotation(value);
		setRotation(value + 1);
		console.log("Index: ", index);
		setSelectedRotationName(specialRotationList[index].rotationName);
	}

	const selectComparePicker = (value, index) => {

		console.log("Index: ", value);
		setSelectedCompareRotation(value);
		const name = generalRotationList[value].rotationName;
		setSelectedCompareRotationName(name);

	}

	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	return (
		<View style={styles.container}>		
		 <Spinner visible={spinner} />			
			<View style={styles.content}>

				{ !isCompare ?
				specialRotationList == undefined ?
				<></>
				:
				 <Picker
					selectedValue={selectedRotation}
					style={{width: Platform.OS === "ios" ? '100%' :  ((selectedRotationName != undefined) && (selectedRotationName.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
						onValueChange={(itemValue, itemIndex) =>
							selectPicker(itemValue, itemIndex)
					}>

					{
						
						specialRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item.rotationName} value={index} key={index}/>
							)
							
						})
						
					}
				
				</Picker>			
				
				:
				<View style={{height: 100, width: '100%', marginTop: -200, alignItems: 'center', alignContent:'center'}}>
				<Picker
					selectedValue={selectedRotation}
					style={{width: Platform.OS === "ios" ? '100%' :  ((selectedRotationName != undefined) && (selectedRotationName.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
						onValueChange={(itemValue, itemIndex) =>
							selectPicker(itemValue, itemIndex)
					}>

					{
						specialRotationList == undefined ?
						<></>
						:
						specialRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item.rotationName} value={index} key={index}/>
							)
							
						})
						
					}
				
				</Picker>		
				<Text style={{alignContent: 'center', marginTop: 50}}>Comparison Rotation</Text>
				<Picker
					selectedValue={selectedCompareRotation}
					style={{width: Platform.OS === "ios" ? '100%' :  ((selectedCompareRotationName != undefined) && (selectedCompareRotationName.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
						onValueChange={(itemValue, itemIndex) =>
							selectComparePicker(itemValue, itemIndex)
					}>

					{
						generalRotationList == undefined ?
						<></>
						:
						generalRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item.rotationName} value={index} key={index}/>
							)
							
						})
						
					}
				
				</Picker>		
				</View>
				}
					
			</View>
			<View style={styles.comparePart}>
				<CheckBox
					value={isCompare}
					onValueChange={setSelection}
					style={styles.checkbox}
					onTintColor={'green'}
					onCheckColor={'green'}
					boxType={'square'}
				/>
				<Text style={styles.checkTxt}>Compare</Text>
			</View>
			<View style={styles.btn}>
				<TouchableOpacity style={styles.signBtn} onPress={()=>onContinue()}>
					<Text style={styles.signBtnsTxt}>Continue</Text>
				</TouchableOpacity>
			</View>
			
			
			<View style={styles.footer}>
				<View style={styles.btnField}>
					<View style={styles.altBtn} >
						<Text style={styles.forgotBtnTxt}>@2021 AccuPin</Text>
					</View>
					<TouchableOpacity style={styles.altBtn} onPress={()=>signOut()}>
						<Text style={styles.signUpBtnTxt}>Sign Out</Text>
					</TouchableOpacity>
				</View>
				
			</View>
		</View >
	)
}