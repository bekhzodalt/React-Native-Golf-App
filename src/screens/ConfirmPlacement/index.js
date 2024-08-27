import React, { useEffect, useState, useCallback } from "react";
import { ImageBackground, Image, TouchableOpacity, Text, View, TouchableWithoutFeedback, Alert, DeviceEventEmitter, ScrollView, useWindowDimensions } from "react-native";

import { StackActions } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';

import styles from "./styles";

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';
import VisageFuctionAPI from '../../factory/VisageFunctionAPI';
import { getAccrossDown } from '../../utils/getDistance';
import DeviceInfo from 'react-native-device-info';

const imageBasicUrl = "https://accupin-green-images-prod.s3.amazonaws.com/";

let accuracy = 100;

export default function ConfirmPlacement(props) {
	const {
		parentCourse,
		childCourse,
		rotation,
		compareRotation,
		isCompare,
		locationMethod,
		pin,
		userLati,
		userLong,
		rotationType,
		rotationName,
		historyArray,
	} = props.route.params;

	const [spinner, setSpinner] = useState(false);
	const [front, setFront] = useState("0");
	const [back, setBack] = useState("0");
	const [left, setLeft] = useState("0");
	const [right, setRight] = useState("0");
	const [rotationFront, setRotationFront] = useState("0");
	const [rotationBack, setRotationBack] = useState("0");
	const [rotationLeft, setRotationLeft] = useState("0");
	const [rotationRight, setRotationRight] = useState("0");
	const [isExistImage, setIsExistImage] = useState(false);
	const [percentAccross, setPercentAccross] = useState(0);
	const [percentDown, setPercentDown] = useState(0);
	const [rotationPercentAccross, setRotationPercentAccross] = useState(0);
	const [rotationPercentDown, setRotationPercentDown] = useState(0);
	const [o8, setO8] = useState(0);
	const [rotationO8, setRotationO8] = useState(0);
	const [distance, setDistance] = useState();
	const [imageUrl, setImageUrl] = useState(imageBasicUrl);
	const {width} = useWindowDimensions();
	const [imageWidth, setImageWidth] = useState(width-19.63);
	const [imageHeight, setImageHeight] = useState(width-19.63);

	const [originPercentAccross, setOriginPercentAccross] = useState(0.5);
	const [originPercentDown, setOriginPercentDown] = useState(0.5);
	const [imageWidthYard, setImageWidthYard] = useState(40.0);
	const [imageHeightYard, setImageHeightYard] = useState(40.0);


	const [ulLat, setUlLat] = useState();
	const [ulLong, setUlLong] = useState();
	const [cogLat, setCogLat] = useState();
	const [cogLong, setCogLong] = useState();
	const [orientation, setOrientation] = useState();

	const [longFactor, setLongFactor] = useState();


	const [locationX, setLocationX] = useState(150);
	const [locationY, setLocationY] = useState(150);

	const [locationX_Rotation, setLocationX_Rotation] = useState(0);
	const [locationY_Rotation, setLocationY_Rotation] = useState(0);

	const [combinedLat, setCombinedLat] = useState(0);
	const [combinedLong, setCombinedLong] = useState(0);

	const [pinLocationArray, setPinLocationArray] = useState([]);

	const [visageUpdate, setVisageUpdate] = useState(true);
	const [extendClub, setExtendClub] = useState("");

	const _pinArr = [];
	var globalWidth = 0;
	var globalHeight = 0;
	var courseData;

	useEffect(() => {
		setSpinner(true)
		setVisageUpdate(true);

		let version = DeviceInfo.getVersion();

		if (locationMethod == "ble") {
			accuracy = props.route.params.accuracy;
		}

		if (locationMethod == 'finger') {
			setLocationX(0);
			setLocationY(0);
		}
		const fileName = parentCourse.toLowerCase().split(" ").join("_") + "/" + childCourse.toLowerCase().split(" ").join("_") + "/" + pin + ".jpg";

		setImageUrl(imageBasicUrl + fileName);
		Image.getSize(imageBasicUrl + fileName, (width, height) => {

		}, err => {
			console.log("err: ", err);
			const fileName = parentCourse.toLowerCase().split(" ").join("_") + "/" + childCourse.toLowerCase().split(" ").join("_") + "/" + pin + ".PNG";
			setImageUrl(imageBasicUrl + fileName);

		});
		
	}, []);

	const getHistoryData = () => {
		var tempArray = []
		for (let i = 0; i < historyArray.length; i++) {
			const accrossDown = getAccrossDown(historyArray[i], courseData);

			var locationXX, locationYY;
			if (globalWidth == 0) {
				locationXX = Number(courseData.image_width_pix) * accrossDown.percentAccross;
				locationYY = Number(courseData.image_height_pix) * accrossDown.percentDown;
			} else {
				locationXX = globalWidth * accrossDown.percentAccross;
				locationYY = globalHeight * accrossDown.percentDown;

			}

			let item = {
				locationX: locationXX,
				locationY: locationYY,
				order: i
			}

			tempArray.push(item);
		}

		setPinLocationArray(tempArray);
	}

	const getPlacement = async (customLati, customLong) => {

		setSpinner(true);
		var placement = ''
		if (isCompare) {
			placement = InvokeLambdaFunctionAPI.getPlacementAPI(parentCourse, childCourse, pin, customLati, customLong, compareRotation, "1");
		} else {
			placement = InvokeLambdaFunctionAPI.getPlacementAPI(parentCourse, childCourse, pin, customLati, customLong, rotation, rotationType);
		}
		placement
			.then((result) => {
				if (result.hasOwnProperty("errorMessage")) {
					Alert.alert(
						'Error',
						'Something was wrong!',
						[{ text: 'OK', onPress: () => console.log("Error") }],
						{ cancelable: false }
					);
				} else {
					if (locationMethod == "finger") {
						setBack("0");
						setFront("0");
						setRight("0");
						setLeft("0");
					} else {
						if (result.hasOwnProperty("front")) {
							setFront(result['front']);
							setBack("0");
						} else {
							setFront("0");
							setBack(result['back']);
						}
						if (result.hasOwnProperty("left")) {
							setLeft(result['left']);
							setRight("0");
						} else {
							setLeft("0");
							setRight(result['right']);
						}

						setCombinedLat(result['combined_lat']);
						setCombinedLong(result['combined_long']);
					}

					if (result.hasOwnProperty("orientation_percent_accross")) {
						setOriginPercentAccross(result['orientation_percent_accross']);
						setOriginPercentDown(result["orientation_percent_down"]);
					}

					if (result.hasOwnProperty("visage_update")) {
						// console.log("Get Visage Update value");
						const visageUpdate = result["visage_update"];
						setVisageUpdate(visageUpdate);
					}

					if (result["extension_data"] != "") {
						let extensionData = result["extension_data"];
						let parentCourse = extensionData["parent_course_name"];
						let childCourse = extensionData["child_course_name"];
						let updateEnable = extensionData["update_enabled"];

						let extendClub = {
							parentCourse: parentCourse,
							childCourse: childCourse,
							updateEnable: updateEnable
						}

						setExtendClub(extendClub);
					}

					if (result.hasOwnProperty("course_data")) {
						courseData = result["course_data"];

						setImageWidthYard(courseData["image_width_yards"]);
						setImageHeightYard(courseData["image_height_yards"]);
						setUlLat(courseData['ul_lat']);
						setUlLong(courseData['ul_long']);
						setCogLat(courseData['cog_lat']);
						setCogLong(courseData['cog_long']);
						setOrientation(courseData['orientation']);
						global.worldToImageTransform = courseData['worldToImageTransform'];
					}

					if (!isCompare) {
						getHistoryData();
					}

					setSpinner(false);

					setLongFactor(result['long_factor']);

					if (result.hasOwnProperty("rotation_front")) {
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
					if (result.hasOwnProperty("rotation_left")) {
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

					if (result.hasOwnProperty("percent_accross")) {
						setPercentAccross(result['percent_accross']);
						setPercentDown(result['percent_down']);
					} else {
						setPercentAccross("");
						setPercentDown("");
					}

					if (result.hasOwnProperty("rotation_percent_accross")) {
						setRotationPercentAccross(result['rotation_percent_accross']);
						setRotationPercentDown(result['percent_down']);
					} else {
						setRotationPercentAccross("");
						setRotationPercentDown("");
					}

					if (result.hasOwnProperty("o8")) {
						setO8(result['o8']);
					} else {
						setO8("");
					}
					if (result.hasOwnProperty("rotation_o8")) {
						setRotationO8(result['rotation_o8']);
					} else {
						setRotationO8("");
					}

					if (result.hasOwnProperty("distance")) {
						if (locationMethod == 'finger') {
							setDistance("0");
						} else {
							setDistance(result['distance']);
						}
					} else {
						setDistance("0");
					}

					const o8Float = parseFloat(result['o8']);
					const percentAccrossFloat = parseFloat(result['percent_accross']);
					const percentDownFloat = parseFloat(parseFloat(result['percent_down']));

					setO8(o8Float);
					setPercentAccross(percentAccrossFloat);
					setPercentDown(percentDownFloat);

					const rotationO8Float = parseFloat(result['rotation_o8']);
					const rotationPercentAccrossFloat = parseFloat(result['rotation_percent_accross']);
					const rotationPercentDownFloat = parseFloat(parseFloat(result['rotation_percent_down']));

					setRotationO8(rotationO8Float);
					setRotationPercentAccross(rotationPercentAccrossFloat);
					setRotationPercentDown(rotationPercentDownFloat);

					if (locationMethod != 'finger') {
						if (o8Float < 270.0 || o8Float > 360.0 || percentAccrossFloat > 1.0 || percentDownFloat > 1.0) {
							Alert.alert(
								'Try new coordinates',
								'This pin placement is off of the green',
								[{ text: 'OK', onPress: () => onReject() }],
								{ cancelable: false }
							);
						}
					}

					const locationX = globalWidth * percentAccrossFloat;
					const locationY = globalHeight * percentDownFloat;

					if (locationMethod != 'finger') {
						setLocationX(locationX);
						setLocationY(locationY);
					} else {
						setLocationX(150);
						setLocationY(150);
					}


					const locationX_Rotation = globalWidth * rotationPercentAccrossFloat;
					const locationY_Rotation = globalHeight * rotationPercentDownFloat;
					setLocationX_Rotation(locationX_Rotation);
					setLocationY_Rotation(locationY_Rotation);

				}
			}).catch((error) => {
				setSpinner(false);
				console.log(error);
			});
	}

	onPressIn = (event) => {
		// because we need ripple effect to be displayed exactly from press point
		// TODO: ....

		setLocationX(event.nativeEvent.locationX);
		setLocationY(event.nativeEvent.locationY);
		const percentPinAccross = event.nativeEvent.locationX / imageWidth;

		var rightAlt, leftAlt, frontAlt, backAlt;
		if (percentPinAccross > originPercentAccross) {
			setLeft("0");
			leftAlt = 0;
			const difference = percentPinAccross - originPercentAccross;
			rightAlt = Math.round(difference * imageWidthYard);
			setRight(rightAlt.toString());
		} else {
			setRight("0");
			rightAlt = 0;
			const difference = originPercentAccross - percentPinAccross;
			leftAlt = Math.round(difference * imageWidthYard);
			setLeft(leftAlt.toString());
		}

		const percentPinDown = event.nativeEvent.locationY / imageHeight;

		var altOriginPercentDown = parseFloat(originPercentDown) + 0.01;
		if (percentPinDown > altOriginPercentDown) {
			setBack("0");
			backAlt = 0;
			const difference = percentPinDown - altOriginPercentDown;
			frontAlt = Math.round(difference * imageHeightYard);
			setFront(frontAlt.toString());
		} else {
			setFront("0");
			frontAlt = 0;
			const difference = altOriginPercentDown - percentPinDown;
			backAlt = Math.round(difference * imageHeightYard);
			setBack(backAlt.toString());
		}

		//////////    Get Distance    //////////////////////////////////////////////
		const rotationPercentAccrossFloat = parseFloat(rotationPercentAccross);
		const rotationPercentDownFloat = parseFloat(rotationPercentDown);

		const deltaX = Math.abs(rotationPercentAccrossFloat - percentPinAccross);
		const deltaXYard = deltaX * imageWidthYard;
		const deltaY = Math.abs(rotationPercentDownFloat - percentPinDown);
		const deltaYYard = deltaY * imageHeightYard;

		const distanceDecimal = Math.sqrt(deltaYYard * deltaYYard + deltaXYard * deltaXYard);
		const distance = Math.round(distanceDecimal);
		setDistance(distance.toString());

		calculateCoordinates(rightAlt, leftAlt, frontAlt, backAlt);

	}

	const calculateCoordinates = (rightAlt, leftAlt, frontAlt, backAlt) => {

		var accross, down, length, q, atanValue, nextValue1, nextValue2, nextValue3, cosValue, sinValue, latitudeValue, longitudeValue;
		rightAlt > 0 ? accross = rightAlt : accross = leftAlt * -1;
		if (accross == 0) {
			accross = 0.001;
		}
		frontAlt > 0 ? down = frontAlt : down = backAlt * -1;
		if (down == 0) {
			down = 0.001;
		}
		length = Math.pow(Math.pow(accross, 2) + Math.pow(down, 2), 0.5);
		if (accross * down > 0) {
			accross > 0 ? q = 2 : q = 4;
		} else {
			accross > 0 ? q = 1 : q = 3;
		}

		atanValue = Math.atan(Math.abs(down) / Math.abs(accross));
		nextValue1 = atanValue * 180 / Math.PI + (q - 1) * 90;

		nextValue2 = (Number(orientation) + nextValue1) % 360;
		q % 2 == 0 ?
			nextValue3 = (nextValue1 - Number(orientation)) % 360
			:
			nextValue3 = nextValue2;
		cosValue = Math.cos(nextValue3 * Math.PI / 180.0) * length;
		sinValue = Math.sin(nextValue3 * Math.PI / 180.0) * length;
		q % 2 == 0 ?
			latitudeValue = Number(cogLat) + cosValue / 121000
			:
			latitudeValue = Number(cogLat) + sinValue / 121000;

		q % 2 == 0 ?
			longitudeValue = Number(cogLong) + sinValue / Number(longFactor)
			:
			longitudeValue = Number(cogLong) + cosValue / Number(longFactor);

		setCombinedLat(latitudeValue);
		setCombinedLong(longitudeValue);
	}

	const onAccept = () => {
		updatePaces();
	}

	const onReject = () => {
		console.log("reject");

		if (locationMethod == 'finger') {
			const popAction = StackActions.pop(1);
			props.navigation.dispatch(popAction);
		} else {
			const popAction = StackActions.pop(2);
			props.navigation.dispatch(popAction);
		}
	}

	const sendVisageStatus = async () => {
		try {
			const result = await InvokeLambdaFunctionAPI.sendVisageStatusAPI(parentCourse, childCourse, pin, rotation)
			console.log("result: ", result);

		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const updateVisage = async () => {

		console.log("CogLati: ", combinedLat);
		console.log("CogLong: ", combinedLong);

		var customLati, customLong;
		if (locationMethod == 'finger') {
			customLati = combinedLat;
			customLong = combinedLong;
		} else {
			customLati = getCustomCoordinate(combinedLat, 0);
			customLong = getCustomCoordinate(combinedLong, 1);
		}

		const tempRotationName = rotationName.substring(0, 1);
		
		try {
			const result = await VisageFuctionAPI.updateVisageAPI(parentCourse, childCourse, pin, rotation, rotationType, tempRotationName, distance, front, back, left, right, customLati, customLong)
			console.log("updateVisageAPI result === ", result);
			setSpinner(false);

			if (result.hasOwnProperty("success")) {

				DeviceEventEmitter.emit("PinUpdated", { parentCourse, childCourse, pin, rotation, customLati, customLong, rotationName, rotationType, locationMethod, accuracy });

				if (extendClub != "") {
					let updateEnable = extendClub.updateEnable;
					let extendChildCourse = extendClub.childCourse;
					let extendParentCourse = extendClub.parentCourse;

					if (updateEnable) {
						updateExtendVisage(extendParentCourse, extendChildCourse, pin, rotation, rotationType, tempRotationName, distance, front, back, left, right, customLati, customLong);
					} else {
						Alert.alert(
							'Congratulations!',
							'Successfully updated',
							[{ text: 'OK', onPress: () => onReject() }],
							{ cancelable: false }
						);
					}

				} else {
					Alert.alert(
						'Congratulations!',
						'Successfully updated',
						[{ text: 'OK', onPress: () => onReject() }],
						{ cancelable: false }
					);
				}


			} else {
				console.log("Visage not updated!!");
				sendVisageStatus();
				const user ="tryAgain"
				DeviceEventEmitter.emit("PinUpdatedAgain", { parentCourse, childCourse, pin, rotation, customLati, customLong, rotationName, rotationType, locationMethod, accuracy, user});
				DeviceEventEmitter.emit("VisageAgain", {parentCourse, childCourse, pin, rotation, rotationType, tempRotationName, distance, front, back, left, right, customLati, customLong });
				Alert.alert(
					'Congratulations!',
					'Successfully updated',
					[{ text: 'OK', onPress: () => onReject() }],
					{ cancelable: false }
				);
			}

		} catch (error) {
			console.log(error);
			setSpinner(false);
		}

		setSpinner(false);
	}

	const updateExtendVisage = async (parentCourse, childCourse, pinNumber, rotation, rotationType, rotationName, distance, front, back, left, right, lati, long) => {
		setSpinner(true)
		try {
			const result = await VisageFuctionAPI.updateVisageAPI(parentCourse, childCourse, pinNumber, rotation, rotationType, rotationName, distance, front, back, left, right, lati, long)
			setSpinner(false);


			if (result.hasOwnProperty("success")) {

				console.log("Successfully Updated Visage!!");

				Alert.alert(
					'Congratulations!',
					'Successfully updated',
					[{ text: 'OK', onPress: () => onReject() }],
					{ cancelable: false }
				);

			} else {
				console.log("Visage not updated!!");
				sendVisageStatus();
			}

		} catch (error) {
			console.log(error);
			setSpinner(false);
		}

		setSpinner(false);
	}

	const getCustomCoordinate = (val, option) => {
		const stringArray = val.toString().split(".");

		const midString = stringArray[1].substring(0, 2);
		if (option == 0) {
			finalString = stringArray[0] + "." + midString + userLati;
		} else {
			finalString = stringArray[0] + "." + midString + userLong;
		}

		return parseFloat(finalString);
	}

	const updatePaces = async () => {

		if (combinedLat == 0 || combinedLong == 0) {
			Alert.alert(
				'Error',
				'Touch screen where cup is located.',
				[{ text: 'OK', onPress: () => { console.log("Error"), setSpinner(false) } }],
				{ cancelable: false }
			);

			return
		} else {

			setSpinner(true);
			var customLati, customLong;
			if (locationMethod == 'finger') {
				customLati = combinedLat;
				customLong = combinedLong;
			} else {
				customLati = getCustomCoordinate(combinedLat, 0);
				customLong = getCustomCoordinate(combinedLong, 1);
			}

			const latString = customLati.toString();
			const longString = customLong.toString();

			let getMode = locationMethod == "finger" ? "F" : locationMethod == "garmin" ? "G" : "B";

			try {
				const result = await InvokeLambdaFunctionAPI.updatePacesAPI(parentCourse, childCourse, pin, rotation, rotationType, distance, front, back, left, right, latString, longString, getMode, accuracy);

				console.log("updatePacesAPI === ", result);
				if (result == "ok") {
					if (visageUpdate) {
						console.log("Visage Update start");
						updateVisage();
					} else {
						console.log("Successfully Updated");

						Alert.alert(
							'Congratulations!',
							'Successfully updated',
							[{ text: 'OK', onPress: () => onReject() }],
							{ cancelable: false }
						);
					}


				} else {
					setSpinner(false);
					Alert.alert(
						'Error',
						'Something was wrong!',
						[{ text: 'OK', onPress: () => { console.log("Error"), setSpinner(false) } }],
						{ cancelable: false }
					);
				}

			} catch (error) {
				console.log(error);
				setSpinner(false);
			}
		}


	}

	const onLayout = useCallback(event => {
		const { height, width } = event.nativeEvent.layout;
		if( globalHeight != height || globalWidth != width ) {
			console.log("Width & Height 2: ", width, height);
			globalHeight = height;
			globalWidth = width;

			getPlacement(userLati, userLong);
		}
	}, []);

	function CustomPin(props) {
		return (

			props.type == 3 ?
				<View style={{
					top: props.locationY - 12, left: props.locationX - 12, width: 24, height: 24,
					borderColor: 'white', borderRadius: 12, borderWidth: 2, position: 'absolute'
				}}>
					<Text style={{ fontSize: 16, color: 'white', top: 0, left: 5 }}>{props.order}</Text>
				</View>
				:
				<View style={{
					top: props.locationY - 12, left: props.locationX - 12, width: 24, height: 24,
					borderColor: props.type == 1 ? '#ea3f25' : 'white', borderRadius: 12, borderWidth: 10, position: 'absolute'
				}}>

				</View>
		)
	};

	const handleError = (e) => { console.log(e.nativeEvent.error); };
	return (

		<View style={styles.container}>
			<ScrollView style={{ width: '95%' }}>
				<Spinner visible={spinner} />

				<View style={styles.header}>
					{
						isCompare ?
							<Text>Rot {rotationName} Pin {pin} vs Rot {compareRotation} Pin {pin}</Text>
							:
							rotationName == "" ?
								<Text> Pin {pin}</Text>
								:

								rotationType == "1" ?
									<Text>Pre-Set {rotationName} / Pin {pin}</Text>
									:
									<Text>Today/Event {rotationName} / Pin {pin}</Text>


					}
					<View style={styles.textContainer}>

						{
							front == "0" ?
								<Text style={styles.headerText}>{back} yds Back,</Text>
								:
								<Text style={styles.headerText}>{front} yds Front,</Text>
						}

						{
							left == "0" ?
								<Text style={styles.headerText}>{right} yds Right of Center</Text>
								:
								<Text style={styles.headerText}>{left} yds Left of Center</Text>
						}
					</View>

					{
						isCompare ?

							<Text style={styles.headerText}>{distance} yds Apart</Text>

							:

							<></>
					}

				</View>
				<View style={styles.imageContainer}>

					{
						locationMethod == 'finger' ?
							<View>

								<ImageBackground style={{ width: "100%", aspectRatio: 1 }} source={{ uri: imageUrl }} 
									onLayout={(event) => onLayout(event)} >
									{
										isCompare ?
											<CustomPin
												locationX={locationX_Rotation}
												locationY={locationY_Rotation}
												type={2}
											/>
											:
											pinLocationArray && pinLocationArray.map((item, index) =>
												<CustomPin
													key={index}
													locationX={item.locationX ? item.locationX : 50}
													locationY={item.locationY ? item.locationY : 50}
													order={item.order + 1}
													type={3}
												/>
											)

									}

								</ImageBackground>
								<TouchableWithoutFeedback onPressIn={onPressIn}>
									<View style={{ width: imageWidth, height: imageHeight, marginTop: -imageHeight }} source={{ uri: imageUrl }} onError={handleError}>

										{
											locationX == 150 ?
												<></>
												:
												<CustomPin
													locationX={locationX}
													locationY={locationY}
													type={1}
												/>
										}
									</View>
								</TouchableWithoutFeedback>
							</View>

							:

							<ImageBackground style={{ width: "100%", aspectRatio: 1 }} source={{ uri: imageUrl }} 
								onLayout={(event) => onLayout(event)} >

								{
									locationX == 150 ?
										<></>
										:
										<CustomPin
											locationX={locationX}
											locationY={locationY}
											type={1}
										/>
								}
								{
									isCompare ?
										<CustomPin
											locationX={locationX_Rotation}
											locationY={locationY_Rotation}
											type={2}
										/>
										:
										pinLocationArray && pinLocationArray.map((item, index) =>
											<CustomPin
												key={index}
												locationX={item.locationX ? item.locationX : 50}
												locationY={item.locationY ? item.locationY : 50}
												order={item.order + 1}
												type={3}
											/>
										)


								}

							</ImageBackground>

					}

				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.rejectBtn} onPress={() => onReject()}>
						<Text style={styles.btnsTxt}>Reject</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept()}>
						<Text style={styles.btnsTxt}>Accept</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View >
	)
}