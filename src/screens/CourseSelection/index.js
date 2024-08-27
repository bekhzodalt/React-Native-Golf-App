import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View, } from "react-native";

import { Auth } from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
export default function CourseSelection(props) {
	const { courseList, parentCourse } = props.route.params;
	const [selectedCourse, setSelectedCourse] = useState('');
	const [spinner, setSpinner] = useState(false);
	useEffect(()=>{
		setSelectedCourse(courseList[0]);	
	},[]);

	const pickerChange = (itemValue) => {
		setSelectedCourse(itemValue);
		console.log(itemValue);
	}

	const onContinue = async() => {

		setSpinner(true);
			try {
				const rotationList =  await InvokeLambdaFunctionAPI.checkIsVisageClub(parentCourse, selectedCourse);
			
				setSpinner(false);
	
				if(rotationList.hasOwnProperty("errorMessage")){	
				
					props.navigation.navigate('LocationMethod', {
						parentCourse: parentCourse,
						childCourse: selectedCourse,
						rotation:"",
						compareRotation: undefined,
						isCompare: false
					});	
							
				
				} else {


					const isVisageClub = rotationList["visage_club"];
					console.log("Is Visage Club: ", isVisageClub);
					
					if(isVisageClub){
						props.navigation.navigate('RotationListScreen', {
							parentCourse: parentCourse,
							childCourse: selectedCourse
						});
					} else {
						props.navigation.navigate('NonSettingScreen', {
							parentCourse: parentCourse,
							childCourse: selectedCourse,
							rotationData: rotationList["rotation_array"]
						});
					}
				}
			} catch (error) {
				setSpinner(false);
				console.log(error);
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
					itemStyle={styles.pickerItemStyle}
					style={styles.pickerStyle}
					onValueChange={(itemValue) => pickerChange(itemValue)}>
					
					{
						courseList == undefined ?
						<></>
						:
						courseList.map(item => {
						
							return(
								<Picker.Item label={item} value={item} key={item}/>
							)
							
						})
						
					}
				
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