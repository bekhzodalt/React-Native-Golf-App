import React, { Component, useEffect, useState, useContext, useCallback} from "react";
import {Platform , Button, TouchableOpacity, Text, View , FlatList, Alert, DeviceEventEmitter, RefreshControl, PermissionsAndroid} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import Moment from 'moment';
import DeviceInfo from 'react-native-device-info';

import styles from "./styles";

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';
import { UserContext } from '../../contexts/ContextManager';

export default function PinSelection(props) {

	const requestAccessFineLocationPermission = async () => {
		const granted = await PermissionsAndroid.request(
		  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
		  {
			title: 'This app uses Bluetooth to communicate with external GPS receivers.',
			message:
			  'In order to perform , you must enable/allow ' +
			  'ble connecttion.',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK',
		  }
		);

		return granted === PermissionsAndroid.RESULTS.GRANTED;
	  };

	React.useLayoutEffect(() => {
	props.navigation.setOptions({
		headerRight: () => (

			Platform.OS === 'android' ? 
				<TouchableOpacity style={{right: 10}} onPress={() => gotToSummary()}><Text>Summary</Text></TouchableOpacity>
				:

				<Button  title="Summary" onPress={() => gotToSummary()} />
		
		),
	});
	}, [props]);
	const {
		parentCourse,
		childCourse,
		rotation,
		compareRotation,
		isCompare,
		locationMethod,
		rotationType,
		rotationName
	} =  props.route.params;
	const [spinner, setSpinner] = useState(false);
	const [pinList, setPinDataList] = useState([]);
	const [pinSummaryList, setPinSummaryList] = useState([]);
	const [rotationCoords, setRotationCoords] = useState([]);
	const [courseData, setCourseData] = useState();
	const {user} = useContext(UserContext);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		console.log("Refresh! Call getPinList")
		getPinList().then(() => setRefreshing(false));
	}, []);

	useEffect(()=>{
		const currentDate = getCurrentDate();
		console.log("------------currentDate-------------", currentDate);
		global.currentDate = currentDate;

		if(global.listnerCount == 0){

			global.listnerCount = 1;
			DeviceEventEmitter.addListener("PinUpdated", (e) => {
				console.log("\Successfully Updated");
		  
				const parentCourse = e.parentCourse;
				const childCourse = e.childCourse;
				const rotationType = e.rotationType;
				const rotationNumber = e.rotation;
				const pinNumber = e.pin;
				const marker = e.rotationName.charAt(0);
	
				const accuPinLati = e.customLati;
				const accuPinLong = e.customLong;

				const locationMethod = e.locationMethod;

				let accuracy = e.accuracy;
				
				if(accuracy == 100){
					accuracy = "";
				}else {
					accuracy = accuracy.toString();
				}
				getConfirmGPS(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker, accuPinLati, accuPinLong, locationMethod, accuracy);
		  
			});
		}
		
		
		const unsubscribe = props.navigation.addListener('focus', () => {
			console.log('Refreshed! Call getPinList');
			getPinList();
		  });
		  return unsubscribe;
		
	},[]);

	const getConfirmGPS = async(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker, accuPinLati, accuPinLong, locationMethod, accuracy) => {
		try {
			const result =await VisageFuctionAPI.getConfirmGPSAPI(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker);
		
			if(result.hasOwnProperty("success")){
				const data = result.data;
				
				const visageLati = data.Latitude;
				const visageLong = data.Longitude;

				let method = "G";
				if(locationMethod == "ble"){
					method = "B";
				}else if(locationMethod == "finger"){
					method = "F";
				}

				const emailStr = user.substring(0, 3);

				let version = DeviceInfo.getVersion();

				if(Number(accuPinLati) == Number(visageLati)){
				
					const content = "success";
					const recipientEmails = [
						"dev.nate116@gmail.com",
						"ko915@outlook.com",
						"tom@accupin.com"
					];
					InvokeLambdaFunctionAPI.sendConfirmEmailAPI(parentCourse, childCourse, marker, pinNumber, recipientEmails, content, method, emailStr, version, accuracy);
				} else {
				
					const content = "nosuccess";
					const recipientEmails = [
						"dev.nate116@gmail.com",
						"ko915@outlook.com",
						"tom@accupin.com"
					];
					InvokeLambdaFunctionAPI.sendConfirmEmailAPI(parentCourse, childCourse, marker, pinNumber, recipientEmails, content, method, emailStr, version, accuracy);
				}
			}

		} catch (err){
			console.log(err);
		}
	}

	const getCurrentDate=()=>{

		var date = new Date().getDate();
		if(date.toString().length == 1){
			date = "0" + date.toString();
		}
		var month = new Date().getMonth() + 1;
		if(month.toString().length == 1){
			month = "0" + month.toString();
		}
		var year = new Date().getFullYear();
		return month + '-' + date;//format: dd-mm-yyyy;
  	}

	const getPinList = async() => {
		setSpinner(true);
		
		var reqRotation = rotation;
		if (rotation == ""){
			reqRotation = "1";
		}
		try {
			const pinList =  await InvokeLambdaFunctionAPI.getPinListAPI(parentCourse, childCourse, reqRotation, rotationType);
			if(locationMethod == "ble" && Platform.OS == "android"){
				requestAccessFineLocationPermission();
			}
			console.log("pins: ", pinList['pins']);
			console.log("rotation_pins: ", pinList['rotation_pins']);
			console.log("Pin Selection 1");

			if(pinList.hasOwnProperty("errorMessage")){		
				console.log("Pin Selection 2");

				setSpinner(false);	
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				if(isCompare){
					getRotationCoords();
				} else {
					setSpinner(false);
				}
				const pinKeyArray = Object.keys(pinList['pins']).map((key) => key);
				console.log("pinKeyArray: ", pinKeyArray);
				const pinDataList = [];

				const pinSummaryList = [];

				const courseData = pinList['course_data'];
				setCourseData(courseData);
			
				for(let i = 0; i < pinKeyArray.length; i++){
					const key = pinKeyArray[i];
					let sortedArray = [];
					let lastUpdate = '';

					let frontBack = '';
					let leftRight = '';
					let getMode = '';
					let accuracy = '';
					
					if(pinList['rotation_pins'][key]){

						const historyArray = pinList['rotation_pins'][key];

						sortedArray = sortHistoryArray(historyArray);

						if(sortedArray[0] != undefined){
							lastUpdate = sortedArray[0].lastUpdate,
							lastUpdate = Moment(lastUpdate).format('MM-DD hh:mm A');
						} 
	
						frontBack = getFrontBackString(sortedArray[0]);
						leftRight = getLeftRightString(sortedArray[0]);

						if(sortedArray[0].hasOwnProperty("getMode")){
							getMode = sortedArray[0].getMode;
						}

						if(sortedArray[0].hasOwnProperty("accuracy")){
							accuracy = sortedArray[0].accuracy;
						}
	
					}

					const item = {
						pinId: key,
						lastUpdate: lastUpdate != '' ? lastUpdate : "",
						recent: pinList.pins[key].recent,
						historyArray: sortedArray,
						frontBack: frontBack,
						leftRight: leftRight ,
						getMode: getMode,
						accuracy: accuracy
					}

					pinDataList.push(item);
	
					if(lastUpdate != ''){

						const item = {
							pinId: key,
							lastUpdate: sortedArray[0].lastUpdate,
							right: Number(sortedArray[0].right),
							left: Number(sortedArray[0].left),
							up: Number(sortedArray[0].up),
							down: Number(sortedArray[0].down),
							lat: Number(sortedArray[0].lat),
							long: Number(sortedArray[0].long),
							getMode: sortedArray[0].getMode,
							accuracy: sortedArray[0].accuracy
						}

						pinSummaryList.push(item);

					}
				}

				setPinDataList(pinDataList);
				console.log("Pin Selection 3 = ", pinDataList[0].frontBack, pinDataList[0].leftRight);

				pinSummaryList.sort((a, b) => a.lastUpdate > b.lastUpdate ? -1: 1);
				setPinSummaryList(pinSummaryList);
			}

		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
	}

	const getRotationCoords = async() => {

		console.log("Compare operation Start!");
		var reqRotation = "1";
		if (compareRotation == ""){
			reqRotation = "1";
		}else {
			reqRotation = compareRotation.substring(0,1);
		}

		var rotationType = "1";

		console.log("compareRotation", reqRotation);
		try {
			const compareRotationPins =  await InvokeLambdaFunctionAPI.getRotationCoordsAPI(parentCourse, childCourse, reqRotation, rotationType);
			
			setSpinner(false);
			if(compareRotationPins.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				const rotationCoords = compareRotationPins["pins"];
				setRotationCoords(rotationCoords);
			}

		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
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

	const sortHistoryArray = (historyArray) => {
		const keys = Object.keys(historyArray).map((key) => key);

		var tempList = [];
		for(let i = 0; i < keys.length; i++){
			const key = keys[i];

			let getMode = "";
			if(historyArray[key].hasOwnProperty("get_mode")){
				getMode = historyArray[key].get_mode;
			}

			let accuracy = "";
			if(historyArray[key].hasOwnProperty("accuracy")){
				accuracy = historyArray[key].accuracy;
			}
		
			if(historyArray[key].last_update){
				item = {
					lastUpdate: historyArray[key].last_update,
					left: historyArray[key].left,
					right: historyArray[key].right,
					up: historyArray[key].up,
					down: historyArray[key].down,
					lat: historyArray[key].lat,
					long: historyArray[key].long,
					getMode: getMode,
					accuracy: accuracy
				};
	
				tempList.push(item);
			
			}
		}
		tempList.sort((a, b) => a.lastUpdate > b.lastUpdate ? -1: 1);

		if(tempList.length > 7){
			const altList = [];
			for(let i = 0; i < 7; i++){
				altList.push(tempList[i]);
			}
			tempList = altList;
		}

		return tempList;
	}

	gotToSummary = () => {

		if(pinSummaryList.length > 0){
			props.navigation.navigate('Summary', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotation:rotation,
				compareRotation: compareRotation,
				isCompare: isCompare,
				pin: item.pinId,
				locationMethod: locationMethod,
				pinSummaryList: pinSummaryList,
				rotationName: rotationName
			});
		} else {
			Alert.alert(	
				'Error', 
				`You don't have any content to show!`,
				[{text: 'OK', onPress: ()=> console.log("Error")}],
				{cancelable: false}
			);
		}
		
	}

	const goToCoordinate = (item) => {

		if(locationMethod == 'finger'){
			props.navigation.navigate('ConfirmPlacement', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotation:rotation,
				compareRotation: compareRotation,
				isCompare: isCompare,
				pin: item.pinId,
				locationMethod: locationMethod,
				userLati: "222",
				userLong: "222",
				rotationName: rotationName,
				rotationType: rotationType,
				historyArray: item.historyArray
			});
		} else if(locationMethod == 'garmin'){
			if(isCompare){
				props.navigation.navigate('EnterCoordinateCompare', {
					parentCourse: parentCourse,
					childCourse: childCourse,
					rotation:rotation,
					compareRotation: compareRotation,
					isCompare: isCompare,
					pin: item.pinId,
					locationMethod: locationMethod,
					rotationName: rotationName,
					rotationType: rotationType
				});
			}else {
				props.navigation.navigate('EnterCoordinates', {
					parentCourse: parentCourse,
					childCourse: childCourse,
					rotation:rotation,
					compareRotation: compareRotation,
					isCompare: isCompare,
					pin: item.pinId,
					historyArray: item.historyArray,
					locationMethod: locationMethod,
					rotationName: rotationName,
					rotationType: rotationType
				});
			}
			
		} else {

			if(Platform.OS == "android"){

				if(requestAccessFineLocationPermission()){
					if(isCompare){
						props.navigation.navigate('EnterCoordinateBLECompare', {
							parentCourse: parentCourse,
							childCourse: childCourse,
							rotation:rotation,
							compareRotation: compareRotation,
							isCompare: isCompare,
							pin: item.pinId,
							locationMethod: locationMethod,
							rotationName: rotationName,
							rotationType: rotationType
						});
					} else {
						props.navigation.navigate('EnterCoordinateBLE', {
							parentCourse: parentCourse,
							childCourse: childCourse,
							rotation:rotation,
							compareRotation: compareRotation,
							isCompare: isCompare,
							pin: item.pinId,
							historyArray: item.historyArray,
							locationMethod: locationMethod,
							rotationName: rotationName,
							rotationType: rotationType
						});
					}
				} else {
					Alert.alert("Attention: ", "You didn't allow BLE connection.")
				}
 
			} else {
				
				if(isCompare){
					props.navigation.navigate('EnterCoordinateBLECompare', {
						parentCourse: parentCourse,
						childCourse: childCourse,
						rotation:rotation,
						compareRotation: compareRotation,
						isCompare: isCompare,
						pin: item.pinId,
						locationMethod: locationMethod,
						rotationName: rotationName,
						rotationType: rotationType
					});
				} else {
					props.navigation.navigate('EnterCoordinateBLE', {
						parentCourse: parentCourse,
						childCourse: childCourse,
						rotation:rotation,
						compareRotation: compareRotation,
						isCompare: isCompare,
						pin: item.pinId,
						historyArray: item.historyArray,
						locationMethod: locationMethod,
						rotationName: rotationName,
						rotationType: rotationType
					});
				}
			
			}
		}
	}

	const renderItem = useCallback( ({item, index}) =>     
		<TouchableOpacity
			style={ item.lastUpdate.includes(global.currentDate) ?  styles.itemGreen : styles.itemBlock}
			onPress={() => goToCoordinate(item)}
			key={index}>
			
				<Text style={styles.pinId}>{item.pinId}</Text>
				<Text style={styles.pinMode}>{item.getMode == "B" && item.accuracy != "" ? item.accuracy : item.getMode}</Text>
				<Text style={styles.pinDate}>{item.frontBack}</Text>	
				<Text style={styles.pinDate}>{item.leftRight}</Text>	
				<Text style={styles.pinDate}>{item.lastUpdate}</Text>	

		</TouchableOpacity>,
		[]
	);
	const keyExtractor = useCallback((item, index) => index.toString(), [])

	const goEmailSend = () => {

		if(pinSummaryList.length > 0){
			props.navigation.navigate('EmailList', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				pinSummaryList: pinSummaryList,
				rotationName: rotationName, 
				isCompare: isCompare,
				rotationCoords: rotationCoords,
				compareRotation: compareRotation.substring(0,1)
			});
		} else {
			Alert.alert(	
				'Error', 
				`You don't have any content to send!`,
				[{text: 'OK', onPress: ()=> console.log("Error")}],
				{cancelable: false}
			);
		}
		
	}

	const goHistoryEmailSend = () => {

		if(pinList.length > 0){
			props.navigation.navigate('HistoryEmailList', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				pinDataList: pinList,
				rotationName: rotationName, 
				courseData: courseData
			
			});
		} else {
			Alert.alert(	
				'Error', 
				`You don't have any content to send!`,
				[{text: 'OK', onPress: ()=> console.log("Error")}],
				{cancelable: false}
			);
		}
		
	}

	return (
		<View style={styles.container}>			
			 <Spinner visible={spinner} />		
			<View style={styles.header}>
				<Text style={styles.headerText}>{childCourse}</Text>
				{
					rotationType == "1" ?
						<Text style={styles.rotationText}>Pre-Set {rotationName}</Text>
						:
						<Text style={styles.rotationText}>Today/Event {rotationName}</Text>
				}
				
			
			</View>
			<View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around"}}>
				<TouchableOpacity 
					style={{backgroundColor: "green", width: 150, justifyContent: 'center', alignContent: 'center', alignItems:'center', height: 30, borderRadius: 10, }}
					onPress={() => goEmailSend()}
				>
					<Text style={{color: 'white', fontSize: 16}}>Daily Report</Text>
				</TouchableOpacity>
				<TouchableOpacity 
					style={{backgroundColor: "green", width: 150, justifyContent: 'center', alignContent: 'center', alignItems:'center', height: 30, borderRadius: 10, }}
					onPress={() => goHistoryEmailSend()}
				>
					<Text style={{color: 'white', fontSize: 16}}>7 day Report</Text>
				</TouchableOpacity>
			</View>
			
			<View style={styles.tlbHeader}>
				<Text style={{textAlign: 'left', flex: 0.8, paddingLeft: 10, paddingTop: 10,}}>Green</Text>
				<Text style={{textAlign: 'left', flex: 0.8, paddingLeft: 10, paddingTop: 10,}}>Mode</Text>
				<Text style={{textAlign: 'left', flex: 1, paddingLeft: 10, paddingTop: 10,}}>F/B</Text>
				<Text style={{textAlign: 'left', flex: 1, paddingLeft: 10, paddingTop: 10,}}>L/R</Text>
				<Text style={{textAlign: 'right', flex: 1, paddingRight: 20, paddingTop: 10}}>Last Update</Text>
			</View>
			<View  style={styles.content}>
				<FlatList
					style={styles.historyContent}
					data={pinList}
					renderItem={renderItem}
					keyExtractor={keyExtractor}
					extraData={pinList}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
			</View >
		</View >
	)
}