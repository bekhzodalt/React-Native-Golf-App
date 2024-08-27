import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert, Text, View, } from "react-native";

import { Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function NonEventSelection(props) {

	const { childCourse, parentCourse, rotationData } = props.route.params;
	const [spinner, setSpinner] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState('1');
	const [rotationList, setRotationList] = useState([]);
	const [eventList, setEventList] = useState([]);
	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	
		checkRotationList();	
	},[]);

	const goToChoice = () => {
		if(selectedCourse == '1'){
			props.navigation.navigate('NonRotationSelection', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotationType: "1", 
				rotationData: rotationData
			});	
		} else {
			props.navigation.navigate('NonRotationEventSelection',{
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotationType: "2",
				rotationData: rotationData
			});	
		}		
	}

	const checkRotationList = () => {
		const keys = Object.keys(rotationData).map((key) => key);

		let eventList = [];
		for(let i =0; i < keys.length; i++){
			const key = keys[i];
			if(key == "1"){
				eventList.push("1");
			}
			if(key == "2"){
				eventList.push("2");
			}
		}

		setEventList(eventList);

		let activeEventType = rotationData["active_rotation"]["type"];
		console.log("activeEventType: ", activeEventType);
		setSelectedCourse(activeEventType);
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
					selectedValue={selectedCourse}
					style={styles.pickerStyle}
					onValueChange={(itemValue, itemIndex) =>
					setSelectedCourse(itemValue)
				}>
					<Picker.Item label="Pre-Set Pins" value="1" />
					{
						eventList.length > 1 ?
							<Picker.Item label="Today/Event Pins" value="2" />
							:
							<></>

					}
					
				
				</Picker>				
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