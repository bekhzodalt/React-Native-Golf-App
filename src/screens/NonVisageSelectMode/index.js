import React, { useEffect, useState } from "react";
import { TouchableOpacity, Alert, Text, View, } from "react-native";

import { Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function NonVisageSelectMode(props) {

	const { childCourse, parentCourse } = props.route.params;
	const [spinner, setSpinner] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState('daily');
	const [rotationList, setRotationList] = useState([]);
	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	
		checkRotationList();	
	},[]);

	const goToChoice = () => {
		if(selectedCourse == 'daily'){
			props.navigation.navigate('NonRotationSelection', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotationType: "1"
			});	
		} else {
			props.navigation.navigate('NonRotationEventSelection',{
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotationType: "2",
				rotationList: rotationList
			});	
		}		
	}

	const checkRotationList = async() => {
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
						rotationItem = {
							rotationName: tempRotationList[itemKey]
						}
						itemList.push(rotationItem);
					}

					rotationList.push(itemList);


				}
				console.log("rotation: ", rotationList);
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
					<Picker.Item label="Pre-Set Pins" value="daily" />
					{
						rotationList.length > 1 ?
							<Picker.Item label="Today/Event Pins" value="event" />
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