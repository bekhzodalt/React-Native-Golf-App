import React, { useEffect, useState } from "react";
import {TouchableOpacity, Alert,Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Picker} from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';
import { Auth } from 'aws-amplify';
import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';

export default function NonRotationSelection(props) {
	const [spinner, setSpinner] = useState(false);
	const { childCourse, parentCourse, rotationData } = props.route.params;
	const [selectedRotation, setSelectedRotation] = useState('');
	const [selectedCompareRotation, setSelectedCompareRotation] = useState('1');
	const [isCompare, setSelection] = useState(false);

	const [rotationList, setRotationList] = useState([]);

	useEffect(()=>{
		console.log("Parent Course: ", parentCourse);
		console.log("Child Course: ", childCourse);	
		getRotationList();
	},[]);


	const getRotationList = () => {

		let activeRotationType = rotationData["active_rotation"]["type"];
		let activeRotationNumber = rotationData["active_rotation"]["number"];

		let rotationArray = rotationData["1"];
		
		let tempArray = [];
		let tempItem = ''
		let keys = Object.keys(rotationArray).map((key) => key);

		for(let i = 0; i < keys.length; i++){
			const key = keys[i];
			let item = rotationArray[key];

			if(activeRotationType == "1" && activeRotationNumber == key){
				item = item + " (AccuCaddie)";
				tempItem = item;
			}

			tempArray.push(item);

		}

		setRotationList(tempArray);
		if(tempItem !== ''){
			setSelectedRotation(tempItem);
		} else {
			setSelectedRotation(tempArray[0]);
		}

		setSelectedCompareRotation(tempArray[0]);
	}

	const onContinue = () => {
		var tempSelectedRotation = '';
		
		props.navigation.navigate('LocationMethod', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			rotation:selectedRotation.substring(0,1),
			compareRotation: selectedCompareRotation.substring(0,1),
			isCompare: isCompare,
			rotationType: "1",
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
						<Picker
							selectedValue={selectedRotation}
							style={{width: Platform.OS === "ios" ? '100%' : selectedRotation.length > 1 ? 160 : 100,
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
								style={{width: Platform.OS === "ios" ? '100%' : ((selectedRotation != undefined) && (selectedRotation.length  > 1)) ? 200 : 100,
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
						
							<Text style={{alignContent: 'center', marginTop: 50, fontSize: 20}}>Comparison Rotation</Text>
						
							

							<Picker
								selectedValue={selectedCompareRotation}
								style={{width: Platform.OS === "ios" ? '100%' : ((selectedCompareRotation != undefined) && (selectedCompareRotation.length  > 1)) ? 200 : 100,
								justifyContent: 'center'}}
									onValueChange={(itemValue, itemIndex) =>
										setSelectedCompareRotation(itemValue)
								}>

								{
								
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