import React, { useEffect, useState } from "react";
import {TouchableOpacity, Alert,Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { Auth } from 'aws-amplify';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';

export default function RotationSelection(props) {
	const [spinner, setSpinner] = useState(false);
	const {childCourse, parentCourse, rotationType } = props.route.params;
	const [selectedRotation, setSelectedRotation] = useState('');
	const [selectedCompareRotation, setSelectedCompareRotation] = useState('1');
	const [isCompare, setSelection] = useState(false);

	const [rotationList, setRotationList] = useState(undefined);

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

	const getRotationList = async(activeRotation) => {

		try {
			var rotationListResult =  await InvokeLambdaFunctionAPI.getRotationListAPI(parentCourse, childCourse);
		
			setSpinner(false);

			if(rotationListResult.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				console.log("Rotation List", rotationListResult);
				console.log("length: ", activeRotation.length);
				if(activeRotation.length == undefined || activeRotation.length > 0 ){
					if(activeRotation.RotationSetType.toString() == rotationType.toString()){
						var tempRotationList = [];
						var tempRotationItem = '';
						for(let i = 0; i < rotationListResult.length; i++){
							
							if(i == activeRotation.RotationNumber - 1){
								tempRotationItem = activeRotation.Marker + " (Active)";
							} else {
								tempRotationItem = rotationListResult[i];
							}
							tempRotationList.push(tempRotationItem);
						}
						
						console.log("rotationList: ", tempRotationList)
						setRotationList(tempRotationList);
						setSelectedRotation(tempRotationList[activeRotation.RotationNumber - 1]);
					} else {
						setRotationList(rotationListResult);
						setSelectedRotation(rotationListResult[0]);
					}
				} else {
					setRotationList(rotationListResult);
					setSelectedRotation(rotationListResult[0]);
				}
				
				
				
				setSelectedCompareRotation(rotationList[0]);
			}
		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
	}

	const onContinue = () => {
		var tempSelectedRotation = '';
	

		var tempSelectedRotation = '';
		if(selectedRotation.length > 0){
			tempSelectedRotation = selectedRotation.substring(0,1);
			console.log("Temp: ", tempSelectedRotation);
		}
		props.navigation.navigate('LocationMethod', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation:selectedRotation.substring(0,1),
			compareRotation: selectedCompareRotation.substring(0,1),
			isCompare: isCompare,
			rotationType: rotationType,
			rotationName: selectedRotation
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
			<View style={styles.content}>
				{
					!isCompare ? 
					
						rotationList == undefined ?
						<></>
						:
						<Picker
							selectedValue={selectedRotation}
							style={{width: Platform.OS === "ios" ? '100%' : selectedRotation.length > 1 ? 200 : 100,
							justifyContent: 'center'}}
							onValueChange={(itemValue, itemIndex) =>
								setSelectedRotation(itemValue)
						}>

						{
							rotationList.map(item => {
							
								return(
									<Picker.Item label={item} value={item} key={item}/>
								)
								
							})
							
						}
					
						</Picker>
						:
						<View style={{height: 100, width: '100%', marginTop: -200, alignItems: 'center', alignContent:'center'}}>
							<Picker
								selectedValue={selectedRotation}
								style={{width: Platform.OS === "ios" ? '100%' : selectedRotation.length > 1 ? 200 : 100,
								justifyContent: 'center'}}
									onValueChange={(itemValue, itemIndex) =>
										setSelectedRotation(itemValue)
								}>

								{
									rotationList == undefined ?
									<></>
									:
									rotationList.map(item => {
									
										return(
											<Picker.Item label={item} value={item} key={item}/>
										)
										
									})
								
								}
							
							</Picker>	
						
							<Text style={{alignContent: 'center', marginTop: 50}}>Comparison Rotation</Text>
						
							

							<Picker
								selectedValue={selectedCompareRotation}
								style={{width: Platform.OS === "ios" ? '100%' : selectedCompareRotation.length > 1 ? 200 : 100,
								justifyContent: 'center'}}
									onValueChange={(itemValue, itemIndex) =>
										setSelectedCompareRotation(itemValue)
								}>

								{
									rotationList == undefined ?
									<></>
									:
									rotationList.map(item => {
									
										return(
											<Picker.Item label={item} value={item} key={item}/>
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