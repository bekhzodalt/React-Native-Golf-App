import React, { Component, useEffect, useState, useContext, useCallback, useRef} from "react";
import {ImageBackground,  Text, View, TouchableOpacity, Dimensions, Animated, TouchableWithoutFeedback, Alert} from "react-native";

import { StackActions } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Auth } from 'aws-amplify';
import styles from "./styles";

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const imageWidth = windowWidth * 0.9;
const imageHeight = imageWidth * 480 / 486;

export default function Summary(props) {
	const {
		childCourse,
		rotationName,
	
		pinSummaryList
	} =  props.route.params; 

	const [spinner, setSpinner] = useState(false);

	const [value1, setValue1] = useState(0);
	const [value2, setValue2] = useState(0);
	const [value3, setValue3] = useState(0);
	const [value4, setValue4] = useState(0);
	const [value5, setValue5] = useState(0);
	const [value6, setValue6] = useState(0);
	const [value7, setValue7] = useState(0);
	const [value8, setValue8] = useState(0);
	const [value9, setValue9] = useState(0);


	useEffect(()=> {	
	

		allocateData();

	}, []);


	const allocateData = () => {
		console.log("Summary::::", pinSummaryList);
		var count1 = 0;
		var count2 = 0;
		var count3 = 0;
		var count4 = 0;
		var count5 = 0;
		var count6 = 0;
		var count7 = 0;
		var count8 = 0;
		var count9 = 0;

		const lastDateStr = pinSummaryList[0].lastUpdate.substring(0, 10);
		const tempSummaryList = [];
		pinSummaryList.map((item) => {
			
			if(item.lastUpdate.includes(lastDateStr)){
				tempSummaryList.push(item);
			}
		})

		tempSummaryList.map((item, index) => {
		
			console.log(item);
			if(item.up >= 5 && item.down == 0){
				if(item.left >= 5 && item.right == 0){
					count1 ++;
				}

				if((item.left < 5 && item.right ==0) || (item.right < 5 && item.left == 0)){
					count2++;
				}

				if(item.right >= 5 && item.left == 0){
					count3++;
				}
			}

			if((item.up < 5 && item.down == 0) || (item.down < 5 && item.up == 0)){
				if(item.left >= 5 && item.right == 0){
					count4 ++;
				}

				if((item.left < 5 && item.right ==0) || (item.right < 5 && item.left == 0)){
					count5++;
				}

				if(item.right >= 5 && item.left == 0){
					count6++;
				}
			}

			if(item.down >= 5 && item.up == 0){
				if(item.left >= 5 && item.right == 0){
					count7 ++;
				}

				if((item.left < 5 && item.right ==0) || (item.right < 5 && item.left == 0)){
					count8++;
				}

				if(item.right >= 5 && item.left == 0){
					count9++;
				}
			}
		})


		setValue1(count1);
		setValue2(count2);
		setValue3(count3);
		setValue4(count4);
		setValue5(count5);
		setValue6(count6);
		setValue7(count7);
		setValue8(count8);
		setValue9(count9);
	}

	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	return (

		<View style={styles.container}>			
			 <Spinner visible={spinner} />		
			<View style={styles.header}>
				<Text style={styles.headerText}>{childCourse}</Text>
				<Text style={styles.rotationText}>Rotation {rotationName}</Text>
			
			</View>
		
			<View style= {{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}>

				<ImageBackground style={{width: imageWidth, height: imageHeight}} source={require('../../assets/summary.png')}>
					<Text style={{position: 'absolute', top: imageHeight * 0.2, left: imageWidth * 0.34, fontSize: 22}}>
						{value1.toString()}
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.2, left: imageWidth * 0.55, fontSize: 22}}>
						{value2.toString()}
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.2, left: imageWidth * 0.76, fontSize: 22}}>
						{value3.toString()}
					</Text>	

					<Text style={{position: 'absolute', top: imageHeight * 0.4, left: imageWidth * 0.34, fontSize: 22}}>
						{value4.toString()}
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.4, left: imageWidth * 0.55, fontSize: 22}}>
						{value5.toString()}
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.4, left: imageWidth * 0.76, fontSize: 22}}>
						{value6.toString()}
					</Text>	

					<Text style={{position: 'absolute', top: imageHeight * 0.6, left: imageWidth * 0.34, fontSize: 22}}>
						{value7.toString()}					
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.6, left: imageWidth * 0.55, fontSize: 22}}>
						{value8.toString()}
					</Text>	
					<Text style={{ position: 'absolute', top: imageHeight * 0.6, left: imageWidth * 0.76, fontSize: 22}}>
						{value9.toString()}
					</Text>
				</ImageBackground>		
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