import React, { Component, useEffect, useState, useContext, useCallback} from "react";
import {Platform , Button, TouchableOpacity, Text, View , FlatList, Alert, } from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { StackActions } from '@react-navigation/native';

import Spinner from 'react-native-loading-spinner-overlay';
import DialogInput from 'react-native-dialog-input';
import Moment from 'moment';
import styles from "./styles";
import { getDistance } from '../../utils/getDistance';

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function EmailList(props) {

	React.useLayoutEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
	
				Platform.OS === 'android' ? 
					<TouchableOpacity style={{right: 15}} onPress={() => setIsDialogVisible(true)}><Text>Add</Text></TouchableOpacity>
					:
	
					<Button  title="Add" onPress={() => setIsDialogVisible(true)} />
			
			),
		});
	}, [props]);

	const {
		parentCourse,
		childCourse,
		rotationName,
		pinSummaryList, 
		isCompare,
		rotationCoords,
		compareRotation
	} =  props.route.params;

	const [spinner, setSpinner] = useState(false);
	const [isDialogVisible, setIsDialogVisible] = useState(false);

	const [emailList, setEmailList] = useState([]);
	const [pinList, setPinList] = useState();


	useEffect(()=>{
	
		getEmailList();
		console.log("Pin Summary List", pinSummaryList);
		console.log("Pin rotationCoords List", rotationCoords);
		configureContent();
		
	},[]);

	const configureContent = () => {
		
		const lastDateStr = pinSummaryList[0].lastUpdate.substring(0, 10);
		pinSummaryList.sort((a, b) => a.lastUpdate < b.lastUpdate ? -1: 1);
		
		const tempSummaryList = [];
		pinSummaryList.map((item) => {
			
			if(item.lastUpdate.includes(lastDateStr)){
				lastUpdate = item.lastUpdate,
				lastUpdate = Moment(lastUpdate).format('MM-DD H:mm');
				lastUpdate = lastUpdate.substring(6);


				frontBack = getFrontBackString(item);
				leftRight = getLeftRightString(item);

				const tempItem = {
					pin_number: item.pinId,
					last_update: lastUpdate,
					front_back: frontBack,
					left_right: leftRight,
					rotation: rotationName,
					long: item.long,
					lat: item.lat
				}
				tempSummaryList.push(tempItem);
			}
		})

		console.log("tempSummaryList", tempSummaryList);
		if(isCompare){
			addCompareRotation(tempSummaryList);
		}else {
			setPinList(tempSummaryList);
		}
		
	}

	const addCompareRotation = (summaryList) => {
		console.log("Summary List", summaryList)
		const tempSummaryList = [];
		summaryList.map((item) => {
			const key = item.pin_number;
			console.log("key", key);
			const comparedItem = rotationCoords[key];
			console.log("comparedItem", comparedItem);

			const distance = getDistance(item.lat, item.long, Number(comparedItem.lat), Number(comparedItem.long));
			console.log("distance", distance);

			const tempItem = {
				pin_number: item.pin_number,
				last_update: item.last_update,
				front_back: item.front_back,
				left_right: item.left_right,
				rotation: item.rotation,
				distance: distance == 0 ? "N/A" : Math.round(distance).toString(),
				compareRotation: compareRotation
			}
			tempSummaryList.push(tempItem);
		})
		setPinList(tempSummaryList);
	}

	const getFrontBackString = (item) => {
		var retrunValue = ''
		if(Number(item.up) == 0){
			retrunValue = item.down + 'F';
		} else {
			retrunValue = item.up + 'B';
		}
		return retrunValue;
	}

	const getLeftRightString = (item) => {
		var retrunValue = ''
		if(Number(item.right) == 0){
			retrunValue = item.left + 'L';
		} else {
			retrunValue = item.right + 'R';
		}
		return retrunValue;
	}

	const getEmailList = async() => {
		setSpinner(true);
		try {
			const emailList =  await InvokeLambdaFunctionAPI.getEmailList(parentCourse, childCourse);
			setSpinner(false);

			if(emailList.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				if(emailList.length > 0){
					const tempList = [];
					for(let i = 0; i < emailList.length; i++){
						const item = {
							email: emailList[i],
							enable: true
						}
						tempList.push(item);
					}

					setEmailList(tempList);
				}
			}
			
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const addNewEmail = (email) => {
		setIsDialogVisible(false);
		if(email != '' || email != undefined){

			if(!isValidEmail(email)){
				Alert.alert(	
					'Error', 
					'Please enter valid email!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				console.log(email);
				const item = {
					email: email,
					enable: true
				}
		
				setEmailList([...emailList, item]);

				const emails = [];
				emailList.map((item) => {				
					
					emails.push(item.email);				
					
				});
				emails.push(email);
				console.log(emails);
				updateEmailDB(emails);
			}

			
		}
		


	}

	const isValidEmail = (email) => {
		
		let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		if(email == undefined){
			return false
		} else {
			

			if(email.length < 8 || (email && regEmail.test(email) === false)){
				return false
			} else {
				return true
			}
		}
	}

	const emailCheck = (itemIndex) => {
		console.log("Email", itemIndex);
		const newArray = [...emailList];
		newArray[itemIndex].enable = !newArray[itemIndex].enable;
		setEmailList(newArray);
	}

	const onSend = async() => {
		if(emailList.length > 0){
			var isValidEmailOption = true;
			const emails = [];
			emailList.map((item) => {
				if(item.enable){
					if(isValidEmail(item.email)){
						emails.push(item.email)
					} else {
						isValidEmailOption = false;
					}
					
				}
				
			});
			console.log(emails);
	
			if (isValidEmailOption){
				console.log("isCompare", pinList);
				InvokeLambdaFunctionAPI.sendEmail(parentCourse, childCourse, rotationName, emails, pinList, isCompare, false);
			
				onReject();
			
			} else {
				Alert.alert(	
					'Error', 
					'Please enter valid email!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			}
		}else {
			Alert.alert(	
				'Error', 
				'Please enter valid email!',
				[{text: 'OK', onPress: ()=> console.log("Error")}],
				{cancelable: false}
			);
		}
		
		
	}

	const updateEmailDB = async(emails) => {
		setSpinner(true);
		try {
			const emailList =  await InvokeLambdaFunctionAPI.addEmails(parentCourse, childCourse, emails);
			setSpinner(false);

			if(emailList.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				Alert.alert(	
					'Success', 
					'New email added successfully',
					[{text: 'OK', onPress: ()=> console.log("ok")}],
					{cancelable: false}
				);
			}
			
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const onReject = () => {
		console.log("reject");
		const popAction = StackActions.pop(1);
		props.navigation.dispatch(popAction);
	
	}

	const renderItem = useCallback( ({item, index}) =>     
		<TouchableOpacity
			style={styles.itemBlock}
			onPress={()=>emailCheck(index)}
			key={index}>
				<Text style={{marginLeft: 10, flex: 0.4, paddingLeft: 10, paddingTop: 10, alignSelf:'center', justifyContent: 'center', alignContent:'center'}}>{index + 1}</Text>
				<Text style={{alignSelf: 'stretch', flex: 1.6, paddingLeft: 10, paddingTop: 10}}>{item.email}</Text>
				<View style={{alignSelf: 'stretch', flex: 0.6, paddingTop: 10, alignContent: 'center', justifyContent:'center', alignItems: 'center'}}>
					<CheckBox
						value={item.enable}
						style={{}}
						onTintColor={'green'}
						onCheckColor={'green'}
						boxType={'square'}
						size={18}
					/>
				</View>
		</TouchableOpacity>
	
	);
	const keyExtractor = useCallback((item, index) => index.toString(), [])

	return (
		<View style={styles.container}>			
			<Spinner visible={spinner} />		
			<View style={styles.header}>
				<Text style={styles.headerText}>{childCourse}</Text>
			
				<Text style={styles.rotationText}>Rotation: {rotationName}</Text>		
			</View>
			
			<View style={{marginTop: 30, height: '60%', width: '95%', justifyContent: "center", borderColor: 'gray', borderWidth: 1}}>
				<View style={styles.tlbHeader}>
					<Text style={{alignSelf: 'stretch', flex: 0.6, paddingLeft: 10, paddingTop: 10,}}>No</Text>
					<Text style={{alignSelf: 'stretch', textAlign: 'center', flex: 4, paddingLeft: 10, paddingTop: 10,}}>Email</Text>
					<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10,}}>Check</Text>
				</View>
				<View  style={styles.content}>
					<FlatList
						style={styles.historyContent}
						data={emailList}
						renderItem={renderItem}
						keyExtractor={keyExtractor}
						extraData={emailList}
						refreshing={isDialogVisible}
					/>
				</View >
			</View>	

			<DialogInput isDialogVisible={isDialogVisible}
				title={"Add Email"}
				message={"Please add new email"}
				hintInput ={"tom@accupin.com"}
				submitInput={ (inputText) => {addNewEmail(inputText)} }
				closeDialog={ () => {setIsDialogVisible(false)}}
				submitText="Add"
			>
			</DialogInput>

			<View style={styles.btn}>
				<TouchableOpacity style={styles.signBtn} onPress={()=>onSend()}>
					<Text style={styles.signBtnsTxt}>Send</Text>
				</TouchableOpacity>
			</View>	
		</View >
	)
}