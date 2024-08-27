import React, { Component,  useState, useContext, useCallback, useEffect} from "react";
import {ImageBackground, Image, TouchableOpacity, TextInput, ScrollView, Alert,  Text, View, Platform, PermissionsAndroid } from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import RNBluetoothClassic from "react-native-bluetooth-classic";
import Dialog, { DialogContent,  DialogFooter, DialogButton, DialogTitle } from 'react-native-popup-dialog';
import RNSpeedometer from 'react-native-speedometer'

import styles from "./styles";
import Colors from '../../constants/Color';
import Images from '../../constants/Images';
import { UserContext } from '../../contexts/ContextManager';
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

global.device =[];
global.connection = false;
global.badElfSubscription = false;
global.isBadElfConnected = false;
import { getAccrossDown} from '../../utils/getDistance';
const imageBasicUrl = "https://accupin-green-images-prod.s3.amazonaws.com/";

export default function EnterCoordinatesBLE(props) {

	const {
		parentCourse,
		childCourse,
		rotation,
		compareRotation,
		isCompare,
		locationMethod,
		pin,
		historyArray,
		rotationName,
		rotationType,
	} =  props.route.params;

	const [spinner, setSpinner] = useState(false);
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');

	const [placeLatiTxt, setPlaceLatiTxt] = useState('Latitude: ');
	const [placeLongTxt, setPlaceLongTxt] = useState('Longitude: ');
	const [visible, setVisible] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [cep, setCep] = useState("0.00");

	const [alertDialogVisible, setAlertDialogVisible] = useState(false);

	var getDataCount = 0;
	var globalWidth = 0;
	var globalHeight = 0;
	var courseData;

	const [imageUrl, setImageUrl] = useState(imageBasicUrl);

	const [pinLocationArray, setPinLocationArray] = useState([]);

	const [cepValue, setCepValue] = useState(9);

	const onLayout = useCallback(event => {
		const {height, width} = event.nativeEvent.layout;
		
		if( globalHeight != height || globalWidth != width ) {
			console.log("Width & Height: ", width, height);
			globalHeight = height;
			globalWidth = width;

			getPinLocation();
		}
	}, []);

	function  CustomPin(props) {
		return (
			<View style={{top: props.locationY-7, left: props.locationX-7, width: 24, height: 24, 
				borderColor: props.type == 1 ?  'white' : 'white', borderRadius: 12, borderWidth: 2, position: 'absolute'}}>
					   <Text style={{fontSize: 16, color: 'white', top: 0, left: 5}}>{props.order}</Text>
			</View>
	)};

	const onReceivedData = async(event) => {
		event.timestamp = new Date();
		console.log("******************00000000000***********************")
		console.log(event.data);
		console.log(event);
		console.log("******************************************")

		if(event.data.includes('$GPGST') || event.data.includes('$GNGST')){
			var dataArray = event.data.split(',');
			// console.log(dataArray);		

			const stdLat = dataArray[6];
			const stdLong = dataArray[7];

			let latSq = Math.pow(Number(stdLat), 2);
			let longSq = Math.pow(Number(stdLong), 2);
			let step1 = latSq + longSq;
			let step2 = Math.pow(step1, 0.5);
			let cepNumber = step2;
			console.log("cep: ", cepNumber.toFixed(2));
			setCep(cepNumber.toFixed(2).toString());
			setCepValue(cepNumber.toFixed(1).toString());
			console.log("___________________ cepNumber: ", cepNumber);
		}
	
		if(event.data.includes('$GPGGA') || event.data.includes('$GNGGA')){
			getDataCount++;
		
			setSpinner(false);
		
			var dataArray = event.data.split(',');

			const latCoords = dataArray[2];
			const latDir = dataArray[3];
			const longCoords = dataArray[4];
			const longDir = dataArray[5];

			var latNormalized = 0.0;
			var longNormalized = 0.0;

			if(latCoords != "" && latDir != "" && longCoords != "" && longDir != ""){
				
				let latArray = latCoords.split('.');
				let latDegrees = Number(latArray[0].substring(0, latArray[0].length - 2));		
				let latMinutes = Number(latArray[0].substring(latArray[0].length - 2, latArray[0].length) + "." +  latArray[1]);
				let lat = latDegrees + latMinutes / 60.0;
				let latRounded = Number(Math.round(1000000 * lat) / 1000000);			

				if(latDir == "S"){
					latNormalized = latRounded * -1.0;
				} else {
					latNormalized = latRounded;
				}

				let longArray = longCoords.split('.');
				let longDegrees = Number(longArray[0].substring(0, longArray[0].length - 2));		
				let longMinutes = Number(longArray[0].substring(longArray[0].length - 2, longArray[0].length) + "." +  longArray[1]);
				let long = longDegrees + longMinutes / 60.0;
				let longRounded = Number(Math.round(1000000 * long) / 1000000);			

				if(longDir == "W"){
					longNormalized = longRounded * -1.0;
				} else {
					longNormalized = longRounded;
				}

				let latString = latNormalized.toString().split(".")[1].substring(2, 6);
				if(latString.length == 3){
					latString = latString + '0';
				}
				if(latString.length == 2){
					latString = latString + '00';
				}
				if(latString.length == 1){
					latString = latString + '000';
				}
				console.log("latString: ", latString);

				let longString = longNormalized.toString().split(".")[1].substring(2, 6);
				if(longString.length == 3){
					longString = longString + '0';
				}
				if(longString.length == 2){
					longString = longString + '00';
				}
				if(longString.length == 3){
					longString = longString + '000';
				}
				console.log("longString: ", longString);

				setLatitude(latString);
				setLongitude(longString);
			}

		}

	}	

	
	useEffect(()=>{
		

		setSpinner(true);
		const fileName = parentCourse.toLowerCase().split(" ").join("_") + "/" + childCourse.toLowerCase().split(" ").join("_") + "/" + pin + ".jpg";

		console.log(fileName);
		setImageUrl(imageBasicUrl + fileName);
		Image.getSize(imageBasicUrl + fileName, (width, height) => {
			console.log("file type: jpg ");
		}, err => {
			console.log("err: ", err);
			const fileName = parentCourse.toLowerCase().split(" ").join("_") + "/" + childCourse.toLowerCase().split(" ").join("_") + "/" + pin + ".PNG";
			setImageUrl(imageBasicUrl + fileName);
		});

		props.navigation.addListener('focus', () => {
			console.log('Refreshed!');
			setBLEDevice();
		});
		return () => {
			if(global.isBadElfConnected){
				disconnectBadElf();
				console.log("isBleConnected: ", isBadElfConnected);
			}
			
		}
		
	}, []);

	const setBLEDevice = async() => {
		setSpinner(true);
		
		try {
			let enabled = await RNBluetoothClassic.isBluetoothEnabled();
			console.log("BLE enabled: ", enabled);
			
			if(!enabled){
				setSpinner(false);
				Alert.alert(
					"Check Phone's Bluetooth Settings",
					"Be sure Bad Elf is Connected",
					[				
						{ text: 'OK', onPress: () => props.navigation.goBack()},
					
					],
					{ cancelable: false }
				);
			}else{
				getBondedBLEDevices();
			}
		} catch (err) {
			setSpinner(false);
			// Handle accordingly
			console.log("Is BLE enabled Err: ", err);
		}
		
	}

	const getBondedBLEDevices = async() => {
		try {
			let paired = await RNBluetoothClassic.getBondedDevices();
			console.log("Paired Devices: ", paired);
			
			let badElfDevices =	isExistBadElf(paired);
			console.log("badElfDevices: ", badElfDevices);
			
			if(badElfDevices == undefined){
				setSpinner(false);
				setAlertDialogVisible(true);
			} else {
			
				let isConnect = false;
				let i = 0;
				while(!isConnect && i < badElfDevices.length){
					isConnect =await connectedBadElf(badElfDevices[i]);
					i++;
				}
				console.log("---isConnectisConnectisConnectisConnect--------->>>>>>>>>>>", isConnect);
				if(!isConnect){
					setVisible(true);
					setIsConnected(false);
					console.log("------------>>>>>>>>>>>");
				}
			}
		} catch (err) {
			// Error if Bluetooth is not enabled
			// Or there are any issues requesting paired devices
			console.log("Bonded erro: ", err);
		}
		
	}

	const isExistBadElf = (pairedDevices) => {
		if(pairedDevices.length == 0){
			return undefined;
		}

		let badElfDevices = [];
		for(let i = 0; i < pairedDevices.length; i++){
			let item = pairedDevices[i];
			let itemName = item.name;
			console.log("Device names: ", itemName);
			if(itemName.includes("Bad Elf")){
				console.log("There is exist!!");
				badElfDevices.push(item);
			}
		}

		if(badElfDevices.length > 0){
			return badElfDevices;
		}else{
			return undefined
		}

		
	}

	const connectedBadElf = async(badElfDevice) => {
		setSpinner(true);
		try {
			let connection = await badElfDevice.isConnected();
			console.log("Connect check: ", connection);
			if (!connection) {
			  connection = await badElfDevice.connect({ delimiter: "\r\n" });
			 
			}
			console.log("Connection!: ", connection);
			if(connection){
				setSpinner(false);
				console.log("Job Start!");
				setVisible(true);
				setIsConnected(true);

				startReadBadElf(badElfDevice);
				return true;
			} else {
				setTimeout(() => {
					console.log("3 sec.")
					return false;
				}, 3000);
			}
		
		  } catch (error) {
			  setSpinner(false);
			// Handle error accordingly
		  }
		
	}

	const disconnectBadElf = async() => {
		try {
			let disconnected = await global.device.disconnect();
			global.isBadElfConnected = disconnected;
		  } catch(error) {
			// Handle error accordingly
		  }
	}

	const startReadBadElf = (device) => {
		console.log("---------------------------Start reading with Bad Elf------------------");
		global.device = device;
		global.isBadElfConnected = true;
		global.badElfSubscription = device.onDataReceived(data =>
			
			onReceivedData(data)
					  
		);
	
	}

	const getHistoryData = () => {
		var tempArray = []
		console.log(courseData);
		for(let i = 0; i < historyArray.length; i++){
			const accrossDown = getAccrossDown(historyArray[i], courseData);
			console.log(accrossDown);

			
			if(globalWidth == 0) {
				locationX = Number(courseData.image_width_pix) * accrossDown.percentAccross;
				locationY = Number(courseData.image_height_pix) * accrossDown.percentDown;
			} else {
				locationX = globalWidth * accrossDown.percentAccross;
				locationY = globalHeight * accrossDown.percentDown;
	
			}

			console.log("x & y", locationX, locationY);
			let item = {
				locationX: locationX, 
				locationY: locationY,
				order: i
			}

			tempArray.push(item);
		}

		setPinLocationArray(tempArray);
	}

	const getPinLocation = async() => {
		setSpinner(true);
		try {
			const pinLocation =  await InvokeLambdaFunctionAPI.getPinLocationAPI(parentCourse, childCourse, pin);
					
			if(pinLocation.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				setSpinner(false);
				const placeholderLati = 'Latitude: ' + pinLocation['lat'];
				const placeholderLong = 'Longitude: ' + pinLocation['long'];

				setPlaceLatiTxt(placeholderLati);
				setPlaceLongTxt(placeholderLong);	

				courseData = pinLocation["course_data"];
				getHistoryData();
				
				if(isConnected){
					setSpinner(false);					
				}
			}
		
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const goToConfirmation = () => {
			global.device.disconnect();
			global.connection = false;

		if((latitude.length != 3 || longitude.length != 3)&&(latitude.length != 4 || longitude.length != 4 || cepValue > 4.5)){
			// Works on both Android and iOS
			Alert.alert(
				'Error',
				'GPS data is not yet captured',
				[				
					{ text: 'OK', onPress: () => console.log()}
				],
				{ cancelable: false }
			);
		} else {
			
			props.navigation.navigate('ConfirmPlacement', {
				parentCourse: parentCourse,
				childCourse: childCourse,
				rotation:rotation,
				compareRotation: compareRotation,
				isCompare: isCompare,
				pin: pin,
				locationMethod: locationMethod,
				userLati: latitude,
				userLong: longitude,
				historyArray: historyArray,
				rotationName: rotationName,
				rotationType, rotationType,
				accuracy: cepValue
			});
		}			
	}	

	const handleCancel = () => {
		setVisible(false);
		
		props.navigation.goBack()
	};
	
	const handleCapture = () => {
		if(cepValue > 9){
			Alert.alert("Alert", "You do not have GPS coordinates.  Please wait for needle to improve.", [{text: "Ok"}], {cancelable: false})
		}else{

			setVisible(false);
			goToConfirmation();
		}
		
	};

	return (
		<View style={styles.container}>		
			<ScrollView style = {{width: '95%'}}>		
			 	<Spinner visible={spinner} />	
			
				<Dialog
					visible={alertDialogVisible}
					onTouchOutside={() => {}}
				>
					<DialogTitle 
					 	textStyle={{fontSize: 20, fontWeight: "400", color: "black"}} 
						align={"center"}
						title= "Bad Elf is Not Paired or Connected "
					/>

					<DialogContent style={{width: "100%"}}>

						<View style={{alignItems: 'center', marginTop: 10}}>
							<Text style={{textAlign: "center", fontSize: 16, marginTop: 5}}>
								If Paired in Bluetooth menu, move phone within 10 yards of Bad Elf.  	
							</Text>
							<Text style={{textAlign: "center", fontSize: 16, marginTop: 5}}>
								Wait 10 seconds and try again.
							</Text>
							<Text style={{textAlign: "center", fontSize: 16, marginTop: 5}}>
								Still not connecting?  
							</Text>
							<Text style={{textAlign: "center", fontSize: 16, marginTop: 5}}>
								Power Bad Elf off and back on and/or power Phone off and back on.  
							</Text>
						</View>
					
					</DialogContent>

					<DialogFooter>
						<DialogButton
							textStyle={{color: Platform.OS == 'android'? '#169689' : '#007ff9'}}
							text="OK"
							onPress={() => {
								setAlertDialogVisible(false);
								props.navigation.goBack()
							}}
						/>
					
					</DialogFooter>

				</Dialog>
				
				<View style={{marginTop: 50}}>
					{
						isConnected ? 
						<View style={{alignItems: 'center', marginLeft: 10}}>
							<Text style={{fontSize: 16, fontWeight: "400", color: "black"}}>
								Press 'Capture' to use device 
								
							</Text>
							<Text style={{fontSize: 16, fontWeight: "400", color: "black"}}>
								coordinates.
							</Text>
							<View style={{height: 20}}>
							</View>
							<RNSpeedometer 
							
								value={0.5-cepValue} 	
								size={200}
								minValue={-4}
								maxValue={0}
								allowedDecimals={1}
								labelStyle={{fontSize: 1, color: "white"}}
								labels={ [
									{
										name: "",
										labelColor: '#ff2900',
										activeBarColor: '#ff2900',
									},
									{
										name: " ",
										labelColor: '#f2cf1f',
										activeBarColor: '#f2cf1f',
										},
									{
										name: "  ",
										labelColor: '#f2cf1f',
										activeBarColor: '#f2cf1f',
									},
									{
										name: "    ",
										labelColor: '#00ff6b',
										activeBarColor: '#00cc33',
									},

								]}
								wrapperSyle={{fontSize:9}}
							/>
						
						</View>
						
						:
						<View style={{alignItems: 'center', marginLeft: 10, marginBottom: 10}}>
							<Text style={{fontSize: 18, fontWeight: "700", color: "black"}}>
								Please check bluetooth connection!
							</Text>
						</View>
						
					}
				</View>

				{
					isConnected ? 
					<View style={{flexDirection: "row", alignContent: "center", justifyContent: "center", alignItems: "center", marginTop: 20, paddingLeft: 50, paddingRight: 50}}>
						<View style={{paddingRight: 5}}>
							<TouchableOpacity onPress={() => {handleCancel()}} style={{width: 100, height: 40, borderRadius: 10, borderWidth: 1, borderColor: "white", alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: "red"}}>
								<Text style={{color: "white", fontSize: 18}}>
									Exit
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{paddingLeft: 15}}>
							<TouchableOpacity onPress={() => {handleCapture()}} style={{width: 100, height: 40, borderRadius: 10, borderWidth: 1, borderColor: "white", alignContent: "center", alignItems: "center", justifyContent: "center", backgroundColor: "green"}}>
								<Text style={{color: "white", fontSize: 18}}>
									Capture
								</Text>
							</TouchableOpacity>
						</View>
						
						

					</View>
					:
					<>
					</>
				}
		
				<View style= {styles.imageContainer}>
				<ImageBackground style={{width: "100%", aspectRatio: 1}} source={{uri: imageUrl}} onLayout={(event) => onLayout(event)}>
					{pinLocationArray && pinLocationArray.map((item, index) => 
						<CustomPin
							key={index}
							locationX = {item.locationX ? item.locationX : 50}
							locationY = {item.locationY ? item.locationY : 50}
							order = {item.order + 1}
							type = {1}
						/>	
					)}				
					</ImageBackground>			
				</View>				
			</ScrollView>		
		</View >
	)
}