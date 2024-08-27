import React, { Component,  useState, useContext, useCallback, useEffect} from "react";
import {ImageBackground, Image, TouchableOpacity, TextInput, ScrollView, Alert, Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";
import Colors from '../../constants/Color';
import Images from '../../constants/Images';
import { UserContext } from '../../contexts/ContextManager';
import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';


const imageBasicUrl = "https://accupin-green-images-prod.s3.amazonaws.com/";


export default function EnterCoordinateCompare(props) {

	const {
		parentCourse,
		childCourse,
		rotation,
		compareRotation,
		isCompare,
		locationMethod,
		pin,
		rotationName,
		rotationType,
		historyArray
	} =  props.route.params;

	const [spinner, setSpinner] = useState(false);
	const [latitude, setLatitude] = useState('');
	const [longitude, setLongitude] = useState('');

	const [baseLati, setBaseLati] = useState();
	const [baseLong, setBaseLong] = useState();

	const [placeLatiTxt, setPlaceLatiTxt] = useState('Latitude: ');
	const [placeLongTxt, setPlaceLongTxt] = useState('Longitude: ');

	const [rotationFront, setRotationFront] = useState("0");
	const [rotationBack, setRotationBack] = useState("0");
	const [rotationLeft, setRotationLeft] = useState("0");
	const [rotationRight, setRotationRight] = useState("0");
	const [isExistImage, setIsExistImage] = useState(false);

	const [rotationPercentAccross, setRotationPercentAccross] = useState(0);
	const [rotationPercentDown, setRotationPercentDown] = useState(0);

	const [imageUrl, setImageUrl] = useState(imageBasicUrl);
	const [imageWidth, setImageWidth] = useState(374);
	const [imageHeight, setImageHeight] = useState(378);

	const [locationX_Rotation, setLocationX_Rotation] = useState(150);
	const [locationY_Rotation, setLocationY_Rotation] = useState(150);
	var globalWidth, globalHeight;

	const onLayout =(event) => {
		const {height, width} = event.nativeEvent.layout;

		if( globalHeight != height || globalWidth != width ) {
			console.log("Width & Height: ", width, height);

			globalHeight = height;
			globalWidth = width;

			getPlacement();
			getPinLocation();
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

	}, []);

	function  CustomPin(props) {
		return (
		<View style={{top: props.locationY-7, left: props.locationX-7, width: 24, height: 24, 
		 borderColor: props.type == 1 ?  '#ea3f25' : 'white', borderRadius: 12, borderWidth: 10, position: 'absolute'}}>
		
		</View>
	  )};

	const getPinLocation = async() => {
		setSpinner(true);
		try {
			const pinLocation =  await InvokeLambdaFunctionAPI.getPinLocationAPI(parentCourse, childCourse, pin);
		
			setSpinner(false);	
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
			}
		
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const getPlacement = async() => {

		setSpinner(true);
		var placement = ''
	
		placement =  InvokeLambdaFunctionAPI.getPlacementAPI(parentCourse, childCourse, pin, '1111', '1111', compareRotation, "1");
		
		placement
		.then((result) => {
			setSpinner(false);
		
			if(placement.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				
			
				if(result.hasOwnProperty("rotation_front")){			
					setRotationFront(result['rotation_front']);
					setRotationBack("0");
					rotationFrontFloat = parseFloat(result['rotation_front']);
					rotationBackFloat = 0.0;
				} else {
					setRotationFront("0");
					setRotationBack(result['rotation_back']);
					rotationFrontFloat = 0.0;
					rotationBackFloat = parseFloat(result['rotation_back']);
				}
				if(result.hasOwnProperty("rotation_left")){			
					setRotationLeft(result['rotation_left']);
					setRotationRight("0");
					rotationLeftFloat = parseFloat(result['rotation_left']);
					rotationRightFloat = 0.0;
				} else {
					setRotationLeft("0");
					setRotationRight(result['rotation_right']);
					rotationLeftFloat = 0.0;
					rotationRightFloat = parseFloat(result['rotation_right']);
				}
	
				setIsExistImage(result['images']);
	
				if(result.hasOwnProperty("rotation_percent_accross")){			
					setRotationPercentAccross(result['rotation_percent_accross']);
					setRotationPercentDown(result['percent_down']);
				} else {
					setRotationPercentAccross("");
					setRotationPercentDown("");
				}
	
				const rotationPercentAccrossFloat = parseFloat(result['rotation_percent_accross']);
				const rotationPercentDownFloat = parseFloat(parseFloat(result['rotation_percent_down']));

				console.log("Image Size: ", globalWidth, globalHeight);
				const locationX_Rotation = globalWidth * rotationPercentAccrossFloat;
				const locationY_Rotation = globalHeight * rotationPercentDownFloat;

				setLocationX_Rotation(locationX_Rotation);
				setLocationY_Rotation(locationY_Rotation);
	
				setRotationPercentAccross(rotationPercentAccrossFloat);
				setRotationPercentDown(rotationPercentDownFloat);
	
	
				
				
			}
		}).catch((error) => {
			setSpinner(false);
			console.log(error);
		});
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

			console.log("Compare Rotation: >>", compareRotation);
			
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

	

	return (
		<View style={styles.container}>	
			<ScrollView style = {{width: '95%'}}>		
				<Spinner visible={spinner}/>		
				<View style={styles.header}>
					<Text style={styles.headerText}>Enter GPS Coordinate</Text>
					{
						rotation == "" ?
						<Text style={{marginTop:10}}>Pin Number: {pin}</Text>
						:
						<Text>Rot {rotationName} Pin {pin} vs Rot {compareRotation} Pin {pin}</Text>
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

					<View style={styles.imageHeader}>
					<Text style={styles.compareText}>Compared Pin</Text>
				
							<Text>Rotation {compareRotation} / Pin Number {pin}</Text>
				
					<View style = {styles.textContainer}>

						{rotationFront == "0" ?
						<Text style={styles.headerImageText}>{rotationBack} yds Back,</Text>
						:
						<Text style={styles.headerImageText}>{rotationFront} yds Front,</Text>
						}
						
						{rotationLeft == "0" ?
						<Text  style={styles.headerImageText}>{rotationRight} yds Right of Center</Text>
						:
						<Text  style={styles.headerImageText}>{rotationLeft} yds Left of Center</Text>
						}
					</View>					
				</View>

				<View style= {styles.imageContainer}>

					<ImageBackground style={{width: "100%", aspectRatio: 1}} source={{uri: imageUrl}} onLayout={(event) => onLayout(event)}>
						<CustomPin
							locationX = {locationX_Rotation ? locationX_Rotation : 50}
							locationY = {locationY_Rotation ? locationY_Rotation : 50}
							type = {2}
						/>
					</ImageBackground>
			
				</View>				
			</ScrollView>
		</View >
	)
}