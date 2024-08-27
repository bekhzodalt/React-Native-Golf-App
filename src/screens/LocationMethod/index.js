import React, { useEffect, useState} from "react";
import {TouchableOpacity, Text, View,} from "react-native";
import {Picker} from '@react-native-picker/picker';
import { Auth } from 'aws-amplify';
import styles from "./styles";

export default function LocationMethod(props) {

	const {
		parentCourse,
		childCourse,
		rotation,
		compareRotation,
		isCompare,
		rotationType,
		rotationName
	} =  props.route.params;

	const [locationMethod, setLocationMethod] = useState('ble');

	useEffect(()=>{
		global.locationMethod = 'ble';
		console.log("Rotation: ", rotation);
		console.log("Compare Rotation: ", compareRotation);			
	},[]);

	const onContinue = () => {
		props.navigation.navigate('PinSelection', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation: rotation,
			compareRotation: compareRotation,
			isCompare: isCompare,
			locationMethod: global.locationMethod,
			rotationType: rotationType,
			rotationName: rotationName
		});
	}

	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	return (
		<View style={styles.container}>			
			<View style={styles.content}>
				<Picker
					selectedValue={locationMethod}
					style={styles.pickerStyle}
					itemStyle={{textAlign: 'center'}}
					onValueChange={(itemValue) =>{
						console.log("itemValue: ", itemValue);
						setLocationMethod(itemValue);
						global.locationMethod = itemValue;
					}
					
				}>
					<Picker.Item label="Bad Elf" value="ble" />
					<Picker.Item label="Garmin" value="garmin" />
					<Picker.Item label="Stylus/Finger" value="finger" />	
				
				</Picker>				
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