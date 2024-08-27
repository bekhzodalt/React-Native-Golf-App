import React, { useEffect, useState } from "react";
import {TouchableOpacity, Alert,Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Picker} from '@react-native-picker/picker';
import { Auth } from 'aws-amplify';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import { StackActions } from '@react-navigation/native';

export default function NonRotationSetting(props) {
	const [spinner, setSpinner] = useState(false);
	const { childCourse, parentCourse, rotationType, rotationList } = props.route.params;
	const [selectedRotation, setSelectedRotation] = useState('');
	const [pickerData, setPickerData] = useState([]);
	const [isCompare, setSelection] = useState(false);

	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	


		getRotationList();
	},[]);

	
	const getRotationList = () => {

		const keys = Object.keys(rotationList).map((key) => key);

		let pickerData = [];
		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			const label = rotationList[key];
		
			pickerData.push(label);
		}
		setPickerData(pickerData);
		setSelectedRotation(pickerData[0]);
		
	}

	const onContinue = async() => {
		const keys = Object.keys(rotationList).map((key) => key);

		let selectedRotationNumber = ''
		
		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			const label = rotationList[key];
			if(label == selectedRotation){
				selectedRotationNumber = key;
				break;
			}
			
		}
		
		console.log("::::::", selectedRotation, selectedRotationNumber);

		setSpinner(true);
		try {
			const result = await InvokeLambdaFunctionAPI.updateActiveRotation(parentCourse, childCourse, rotationType, selectedRotationNumber)
			console.log("result: ", result);
			setSpinner(false);
			

			if(result.hasOwnProperty("success")){
			
				console.log("Successfully Updated Visage!!");

				Alert.alert(	
					'Congratulations!', 
					'AccuCaddie Pins Successfully Set',
					[{text: 'OK', onPress: ()=> onReject()}],
					{cancelable: false}
				);
				
			} else {
				
				Alert.alert(	
					'Error', 
					'Something is wrong',
					[{text: 'OK', onPress: ()=> {console.log("Error"), setSpinner(false)}}],
					{cancelable: false}
				);
			}
		} catch (error){
			console.log(error);
			setSpinner(false);
		}
		
	}

	const onReject = () => {
		console.log("reject");
		const popAction = StackActions.pop(2);
		props.navigation.dispatch(popAction);
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
				
				<Picker
					selectedValue={selectedRotation}
					style={{width: Platform.OS === "ios" ? '100%' : selectedRotation.length > 1 ? 160 : 100,
					justifyContent: 'center'}}
					onValueChange={(itemValue, itemIndex) =>
						setSelectedRotation(itemValue)
				}>

				{
					pickerData.map((item, index) => {
					
						return(
							<Picker.Item label={item} value={item} key={index}/>
						)
						
					})
					
				}
			
				</Picker>
							
			</View>
			
			<View style={styles.btn}>
				<TouchableOpacity style={styles.signBtn} onPress={()=>onContinue()}>
					<Text style={styles.signBtnsTxt}>Set as AccuCaddie Pins</Text>
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