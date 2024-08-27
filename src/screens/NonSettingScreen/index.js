import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert, Text, View, } from "react-native";

import { Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function NonSettingScreen(props) {

	const { childCourse, parentCourse, rotationData } = props.route.params;
	const [spinner, setSpinner] = useState(false);

	const [rotationList, setRotationList] = useState([]);
	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	
		console.log("rotationData", rotationData);

	},[]);

	const goContinue = async() => {

		setSpinner(true);
		try {
			const rotationList =  await InvokeLambdaFunctionAPI.checkIsVisageClub(parentCourse, childCourse);
		
			setSpinner(false);

			const isVisageClub = rotationList["visage_club"];
			console.log("Is Visage Club: ", isVisageClub);

			let	rotationArray = rotationList["rotation_array"];
			const keys = Object.keys(rotationArray).map((key) => key);

			let isActiveRotation = false;

			for(let i =0; i < keys.length; i++){
				const key = keys[i];
				if(key == "active_rotation"){
					isActiveRotation = true;
				}
				
			}

			if(isActiveRotation){
				console.log("isActiveRotation: ", isActiveRotation);
				props.navigation.navigate('NonEventSelection', {
					parentCourse: parentCourse,
					childCourse: childCourse,
					rotationData: rotationArray
				});	
			} else {
				Alert.alert(	
					'Error', 
					'You should set AccuCaddie pin',
					[{text: 'OK', onPress: ()=> {console.log("Error"), setSpinner(false)}}],
					{cancelable: false}
				);
			}		
			
		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
	}

	const goSetting = () => {
		props.navigation.navigate('NonEventSetting',{
			parentCourse: parentCourse,
			childCourse: childCourse,

			rotationData: rotationData
		});	
	}

	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	return (
		<View style={styles.container}>		
			<Spinner visible={spinner} />			
			<View style={{justifyContent: "space-around", flex: 0.6, marginTop: 50}}>
				<View style={{alignContent: "center", alignItems: "center"}}>
					<Text style={{fontSize: 20, fontWeight: "bold"}}>Select Action</Text>
				</View>
				<View style={styles.btn}>
					<TouchableOpacity style={styles.firstBtn} onPress={()=>goContinue()}>
						<Text style={styles.signBtnsTxt}>Capture New Pin Locations</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.btn}>
					<TouchableOpacity style={styles.secondBtn} onPress={()=>goSetting()}>
						<Text style={styles.signBtnsTxt}>Set AccuCaddie Pins</Text>
					</TouchableOpacity>
				</View>
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