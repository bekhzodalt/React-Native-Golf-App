import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert, Text, View, } from "react-native";

import { Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import CheckBox from '@react-native-community/checkbox';

import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';

export default function RotationListScreen(props) {

	const { childCourse, parentCourse } = props.route.params;
	const [spinner, setSpinner] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState('daily');
	const [rotationList, setRotationList] = useState([]);
	const [selectedRotationList, setSelectedRotationList] = useState([]);
	const [selectedRotation, setSelectedRotation] = useState("");
	
	const [compareRotationList, setCompareRoationList] = useState([]);
	const [selectedCompareRotation, setSelectedCompareRotation] = useState('1');
	const [isCompare, setSelection] = useState(false);


	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	
		getActiveRotation();
		
	},[]);

	const getActiveRotation = async() => {
		setSpinner(true);
		try {
			const activeRotationInfo =  await VisageFuctionAPI.getActiveRotationAPI(parentCourse, childCourse);

			if(activeRotationInfo.hasOwnProperty("success")){		
				
				
				const activeRotation = activeRotationInfo['result'];
				console.log("activeRotationInfo", activeRotation);
			
				checkRotationList(activeRotation);		
				
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

	const goToChoice = () => {
		console.log("Rotation Name: ", selectedRotation);

		let rotationNumber = 1;
		let rotationType = '1';

		for(let i = 0; i < 2; i++){
			for(let j = 0; j < rotationList[i].length; j++){
				if(rotationList[i][j].substring(0, 1) == selectedRotation.substring(0, 1)){
					rotationNumber = j + 1;
					const tempRotationType = i + 1;
					rotationType = tempRotationType.toString();
				}
			}
		}

		console.log("rotation Number: ", rotationNumber);
		console.log("rotationType: ", rotationType);

		props.navigation.navigate('LocationMethod', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation: rotationNumber.toString(),
			compareRotation: selectedCompareRotation.substring(0,1),
			isCompare: isCompare,
			rotationType: rotationType,
			rotationName: selectedRotation.substring(0, 1)
		});	
			
	}

	const checkRotationList = async(activeRotation) => {
		setSpinner(true);
		try {
		
			const rotationInstance =  await InvokeLambdaFunctionAPI.checkRotationListAPI(parentCourse, childCourse);
			setSpinner(false);

			if(rotationInstance.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				const rotationArray = rotationInstance.rotation_array;
				const rotationArrayKeys = Object.keys(rotationArray);

				const rotationList = [];
				for(let i = 0; i < rotationArrayKeys.length; i++){
					let key = rotationArrayKeys[i];

					var itemList = [];
					const tempRotationList = rotationArray[key];
					const tempKeys = Object.keys(tempRotationList);
					
					for(let j = 0; j < tempKeys.length; j++){
						const itemKey = tempKeys[j];

						let tempRotationName = tempRotationList[itemKey];
						if(activeRotation.Marker == tempRotationName){
							tempRotationName = tempRotationName + (" (Active)");
							setSelectedRotation(tempRotationName);
						}
					
						itemList.push(tempRotationName);
					}

					rotationList.push(itemList);

				}

				let allRotationList = [...rotationList[0], ...rotationList[1]];

				setSelectedRotationList(allRotationList);
		
				setCompareRoationList(rotationList[0])
				setRotationList(rotationList);
			
			}
			
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	const onChangeSelectedCourse = (itemValue) => {
		console.log("selectedCourse: ", itemValue);

		if(itemValue == 'daily'){
			setSelectedCourse('daily');
			setSelectedRotationList(rotationList[0]);
			setSelectedRotation(rotationList[0][0]);

		} else {
			setSelectedCourse('event');
			setSelectedRotationList(rotationList[1]);
			setSelectedRotation(rotationList[1][0]);

		}
	}

	const onChangeSelectedRotation = (itemValue) => {
		console.log("selected rotation: ", itemValue);

		
		setSelectedRotation(itemValue);

	
	}

	return (
		<View style={styles.container}>		
			<Spinner visible={spinner} />			
			<View style={styles.content}>
			
				<Picker
					selectedValue={selectedRotation}
					style={styles.pickerStyle}
					onValueChange={(itemValue, itemIndex) =>
						onChangeSelectedRotation(itemValue)
				}>

					{
						selectedRotationList.map(item => {
							return(
								<Picker.Item label={item} value = {item} key = {item}/>
							)
						})
					}
					
				</Picker>
				{
					!isCompare ?
					<></>
					:
					<Text style={{marginTop: 20}}>Compare Rotation</Text>
				}
			
				{
					!isCompare ?
					<></>
					:
				
					<Picker
						selectedValue={selectedCompareRotation}
						style={styles.comparePickerStyle}
						onValueChange={(itemValue, itemIndex) =>
							setSelectedCompareRotation(itemValue)
					}>

						{
							compareRotationList.map(item => {
								return(
									<Picker.Item label={item} value = {item} key = {item}/>
								)
							})
						}
						
					</Picker>

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
					<TouchableOpacity style={styles.signBtn} onPress={()=>goToChoice()}>
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