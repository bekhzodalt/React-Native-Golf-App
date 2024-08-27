import React, { useEffect, useState } from "react";
import {TouchableOpacity, Alert, Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { Auth } from 'aws-amplify';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';
export default function NonRotationEventSelection(props) {
	const [spinner, setSpinner] = useState(false);
	const { childCourse, parentCourse, rotationData } = props.route.params;
	const [selectedRotation, setSelectedRotation] = useState('');
	const [selectedRotationName, setSelectedRotationName] = useState('');
	const [selectedCompareRotation, setSelectedCompareRotation] = useState('1');

	const [isCompare, setSelection] = useState(false);

	const [specialRotationList, setSpecialRotationList] = useState([]);
	const [generalRotationList, setGeneralRotationList] = useState([]);

	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	

		getRotationList();
	
	},[]);

	
	const getRotationList = () => {

		let activeRotationType = rotationData["active_rotation"]["type"];
		let activeRotationNumber = rotationData["active_rotation"]["number"];

		let rotationArray = rotationData["2"];
		
		let tempArray = [];
		let tempItem = ''
		let keys = Object.keys(rotationArray).map((key) => key);

		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			let item = rotationArray[key];

			if(activeRotationType == "2" && activeRotationNumber == key){
				item = item + " (AccuCaddie)";
				tempItem = item;
			}

			tempArray.push(item);
		}

		setSpecialRotationList(tempArray);

		if(tempItem !== ""){
			setSelectedRotation(tempItem);
		}else {
			setSelectedRotation(tempArray[0]);
		}
		

		rotationArray = rotationData["1"];
		
		tempArray = [];
		tempItem = ''
		keys = Object.keys(rotationArray).map((key) => key);

		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			let item = rotationArray[key];

			if(activeRotationType == "1" && activeRotationNumber == key){
				item = item + " (AccuCaddie)";
				tempItem = item;
			}

			tempArray.push(item);
		}

		setGeneralRotationList(tempArray);
		setSelectedCompareRotation(tempArray[0])

	}

	const onContinue = () => {
		console.log("selected Rotation: ", selectedRotation);
		console.log("selected compare rotation", selectedCompareRotation);

		const keys = Object.keys(rotationData["2"]).map((key) => key);

		let selectedSpecialRotationNumber = '';

		console.log("Keys: ", keys);
		console.log("data: ", rotationData["2"]);
		console.log("First : ", selectedRotation.substring(0,1));
		
		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			const label = rotationData["2"][key];
			if(label == selectedRotation.substring(0,1)){
				selectedSpecialRotationNumber = key;
				break;
			}
			
		}

		console.log("special selected key: ", selectedSpecialRotationNumber);
		console.log("selectedRotationName: ", selectedRotationName);
		props.navigation.navigate('LocationMethod', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation: selectedSpecialRotationNumber,
			compareRotation: selectedCompareRotation,
			isCompare: isCompare,
			rotationType: "2",
			rotationName: selectedRotation.substring(0,1)
		});	
		
	}

	const selectPicker = (value, index) => {
		console.log("value: ", value);
		setSelectedRotation(value);
	}

	const selectComparePicker = (value, index) => {

		console.log("value: ", value);
		setSelectedCompareRotation(value);

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
				
				 <Picker
					selectedValue={selectedRotation}
					style={{width: Platform.OS === "ios" ? '100%' :  ((selectedRotation != undefined) && (selectedRotation.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
						onValueChange={(itemValue, itemIndex) =>
							selectPicker(itemValue, itemIndex)
					}>

					{
						
						specialRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item} value={item} key={index}/>
							)
							
						})
						
					}
				
				</Picker>			
				
				:
				<View style={{height: 100, width: '100%', marginTop: -200, alignItems: 'center', alignContent:'center'}}>
				<Picker
					selectedValue={selectedRotation}
					style={{width: Platform.OS === "ios" ? '100%' :  ((selectedRotation != undefined) && (selectedRotation.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
						onValueChange={(itemValue, itemIndex) =>
							selectPicker(itemValue, itemIndex)
					}>

					{
						
						specialRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item} value={item} key={index}/>
							)
							
						})
						
					}
				
				</Picker>		
				<Text style={{alignContent: 'center', marginTop: 50, fontSize: 20}}>Comparison Rotation</Text>
				<Picker
					selectedValue={selectedCompareRotation}
					style={{width: Platform.OS === "ios" ? '100%' :    ((selectedCompareRotation != undefined) && (selectedCompareRotation.length  > 1)) ? 200 : 100,
					justifyContent: 'center'}}
					onValueChange={(itemValue, itemIndex) =>
						selectComparePicker(itemValue, itemIndex)
				}>

					{
					
						generalRotationList.map((item, index) => {
						
							return(
								<Picker.Item label={item} value={item} key={index}/>
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