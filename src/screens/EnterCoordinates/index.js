import React, { useState, useEffect} from "react";
import {ImageBackground, Image, TouchableOpacity, TextInput, ScrollView, Alert,Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import { getAccrossDown} from '../../utils/getDistance';

const imageBasicUrl = "https://accupin-green-images-prod.s3.amazonaws.com/";

export default function EnterCoordinates(props) {

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
		rotationType
	} =  props.route.params;
	const [spinner, setSpinner] = useState(false);
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');

	const [baseLati, setBaseLati] = useState();
	const [baseLong, setBaseLong] = useState();

	const [placeLatiTxt, setPlaceLatiTxt] = useState('Latitude: ');
	const [placeLongTxt, setPlaceLongTxt] = useState('Longitude: ');

	const [imageUrl, setImageUrl] = useState(imageBasicUrl);

	const [pinLocationArray, setPinLocationArray] = useState([]);

	const _pinArr = [];
	var globalWidth = 0;
	var globalHeight = 0;
	var courseData;
	
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

				
	
	}, []);

	const getHistoryData = () => {
		var tempArray = []
		console.log(courseData);
		for(let i = 0; i < historyArray.length; i++){
			const accrossDown = getAccrossDown(historyArray[i], courseData);
			console.log(accrossDown);

			var locationX, locationY;
			if(globalWidth == 0) {
				locationX = Number(courseData.image_width_pix) * accrossDown.percentAccross;
				locationY = Number(courseData.image_height_pix) * accrossDown.percentDown;
			} else {
				locationX = globalWidth * accrossDown.percentAccross;
				locationY = globalHeight * accrossDown.percentDown;
	
			}

			console.log("globalwidth, x & y", globalWidth, locationX, locationY);
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
				setBaseLati(pinLocation['lat']);
				setBaseLong(pinLocation['long']);

				const placeholderLati = 'Latitude: ' + pinLocation['lat'];
				const placeholderLong = 'Longitude: ' + pinLocation['long'];

				setPlaceLatiTxt(placeholderLati);
				setPlaceLongTxt(placeholderLong);	

				console.log("---------------------------<><><>------------------------");
				console.log(pinLocation);

				courseData = pinLocation["course_data"];
				getHistoryData();
				setSpinner(false);
			}
		
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const goToConfirmation = () => {

		if((latitude.length != 3 || longitude.length != 3)&&(latitude.length != 4 || longitude.length != 4)){
			// Works on both Android and iOS
			Alert.alert(
				'Error',
				'Enter Last 3 lat and Long Digits',
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
				rotationName:rotationName,
				rotationType, rotationType
			});
		}

			
	}

	const onLayout =(event) => {
		const {height, width} = event.nativeEvent.layout;

		if( globalHeight != height || globalWidth != width ) {
			console.log("Width & Height: ", width, height);

			globalHeight = height;
			globalWidth = width;

			getPinLocation();
		}
	}

	function  CustomPin(props) {
	
		return (
		<View style={{top: props.locationY-7, left: props.locationX-7, width: 24, height: 24, 
		 borderColor: props.type == 1 ?  'white' : 'white', borderRadius: 12, borderWidth: 2, position: 'absolute'}}>
				<Text style={{fontSize: 16, color: 'white', top: 0, left: 5}}>{props.order}</Text>
		</View>
		
	  )};

	

	return (
		<View style={styles.container}>		
		<ScrollView style = {{width: '95%'}}>		
			 <Spinner visible={spinner} />		
			<View style={styles.header}>
				<Text style={styles.headerText}>Enter GPS Coordinate</Text>
				{
					rotation == "" ?
					<Text style={{marginTop:10}}>Pin Number: {pin}</Text>
					:
					rotationType == "1" ?
					<Text>Pre-Set {rotationName} / Pin {pin}</Text>
					:
					<Text>Today/Event {rotationName} / Pin {pin}</Text>
				}			

				{
					locationMethod == 'garmin' ?
						<Text style={{marginTop: 20, fontSize: 14}}>Enter Last 3 Lat & Long Digits</Text>
					:
					<></>

				}
				
			</View>

			<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Latitude *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder={placeLatiTxt}
						placeholderTextColor= "darkgray"					
						keyboardType='numeric'
						value={latitude} 
						autoCapitalize="none" 
						onChangeText={(value) => setLatitude(value)}
					/>
				</View>

				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Longitude *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder= {placeLongTxt}
						placeholderTextColor= "darkgray"
						keyboardType='numeric'					
						value={longitude} 
						autoCapitalize="none" 
						onChangeText={(value) => setLongitude(value)}
					/>
				</View>
				<View style={styles.btn}>
					<TouchableOpacity style={styles.signBtn} onPress={()=>goToConfirmation()}>
						<Text style={styles.signBtnsTxt}>Continue</Text>
					</TouchableOpacity>
				</View>

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