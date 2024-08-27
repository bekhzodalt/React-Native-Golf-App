import React, { useEffect, useState, useContext } from "react";
import { TouchableOpacity, Alert,  Text, View, Modal, TextInput} from "react-native";

import { Picker } from '@react-native-picker/picker';
import { Auth } from 'aws-amplify';
import Spinner from 'react-native-loading-spinner-overlay';
import styles from "./styles";

import { UserContext } from '../../contexts/ContextManager';

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function ClubSelection(props) {
	const [spinner, setSpinner] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState('');
	const {user} = useContext(UserContext);
	const [clubList, setClubList] = useState(undefined);
	const [clubListArray, setClubListArray] = useState(undefined);
	const [showModal, setShowModal] = useState(false);
	const [confirmTxt, setConfirmTxt] = useState("");
	useEffect(()=>{
		global.listnerCount = 0;
		getClubList();
	},[]);

	const getClubList = async() => {
		setSpinner(true);
		try {
			console.log("User Email: ", user);
			const clubList =  await InvokeLambdaFunctionAPI.getClubListAPI(user);
			setSpinner(false);

			if(clubList.hasOwnProperty("errorMessage")){			
				Alert.alert(	
					'Error', 
					'Something was wrong!',
					[{text: 'OK', onPress: ()=> console.log("Error")}],
					{cancelable: false}
				);
			} else {
				
				setClubList(clubList);
				const clubListArray = Object.keys(clubList);

				const tempArray = [...clubListArray].sort((a, b) => {
					const nameA = a; // ignore upper and lowercase
					const nameB = b; // ignore upper and lowercase
					if (nameA < nameB) {
					return -1;
					}
					if (nameA > nameB) {
					return 1;
					}
					// names must be equal
					return 0;
				});

				console.log("temp Array: ", tempArray);
				setClubListArray(tempArray);
				setSelectedCourse(tempArray[0]);
			}
			
		} catch (error) {
			console.log(error);
			setSpinner(false);
		}
	}

	const pickerChange = (itemValue) => {
		setSelectedCourse(itemValue);

	}
	const signOut = () => {
		Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log('eror===', err));
	}

	const onContinue = async() => {
		
		const courseList = clubList[selectedCourse];

		console.log("courseList: ", courseList);

		if(courseList.length > 1){
			props.navigation.navigate('CourseSelection', {
				parentCourse: selectedCourse,
				courseList: courseList
			});	
		} else {
			
			setSpinner(true);
			try {
				const rotationList =  await InvokeLambdaFunctionAPI.checkIsVisageClub(selectedCourse, courseList[0]);
			
				setSpinner(false);
	
				if(rotationList.hasOwnProperty("errorMessage")){	
				
					props.navigation.navigate('LocationMethod', {
						parentCourse: selectedCourse,
						childCourse: courseList[0],
						rotation:"",
						compareRotation: undefined,
						isCompare: false
					});	
							
				
				} else {

					const isVisageClub = rotationList["visage_club"];
					console.log("Is Visage Club: ", isVisageClub);
			
					if(isVisageClub){
						props.navigation.navigate('RotationListScreen', {
							parentCourse: selectedCourse,
							childCourse: courseList[0]
						});	
					} else {
						props.navigation.navigate('NonSettingScreen', {
							parentCourse: selectedCourse,
							childCourse: courseList[0],
							rotationData: rotationList["rotation_array"]
						});	
					}
				}
			} catch (error) {
				setSpinner(false);
				console.log(error);
			}
			
		}
	}
	
	const onDeleteAccount = () => {

		if(confirmTxt == 'delete'){
			setSpinner(true);
			Auth.currentAuthenticatedUser({
				bypassCache: true  // Optional, By default is false. 
			}).then((user) => {
	
				user.deleteUser((error, data) => {
					if (error) {
						throw error;
					}
					setSpinner(false);
	
					Auth.signOut({ global: true });
				});
			}).catch(err => console.log(err));
		}
	}
	return (
		<View style={styles.container}>		
	 		<Spinner visible={spinner} />	
			 <Modal
				visible={showModal}
				animationType="none"
				transparent={true}
			
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={{fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 20, textAlign: "center"}}>
						Do you really want to delete your account?
						</Text>
						<View style={{flexDirection: "row", marginBottom: 20}}>
							<Text style={{fontSize: 16}}>
								Please type  
							</Text>
							<Text style={{fontWeight: 'bold', fontSize: 16, marginLeft: 5, marginRight: 5}}>
								 delete
							</Text>
							<Text style={{fontSize: 16}}>
								to confirm.
							</Text>
						</View>
						
						<TextInput style={styles.textInputField}

							placeholderTextColor="darkgray"

							keyboardType="email-address"

							value={confirmTxt}

							autoCapitalize="none"

							onChangeText={(value) => setConfirmTxt(value)}

						/>

						<View style={styles.confirmBtnFld}>
							<TouchableOpacity style={styles.confirmBtn} onPress={() => onDeleteAccount()}>

								<Text  style={styles.confirmBtnTxt}>PERMANENTLY DELETE </Text>

							</TouchableOpacity>
						</View>

						<View style={styles.cancelBtnFld}>
							<TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>

								<Text  style={styles.cancelBtnTxt}>Cancel </Text>

							</TouchableOpacity>
						</View>
					</View>
					
				</View>
				
			</Modal>
			<View style={styles.content}>
				<Picker
					selectedValue={selectedCourse}
					itemStyle={styles.pickerItemStyle}
					style={styles.pickerStyle}
					onValueChange={(itemValue) => pickerChange(itemValue)}>
					
					{
						clubListArray == undefined ?
						<></>
						:
						clubListArray.map(item => {
						
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
					<TouchableOpacity style={styles.signOutBtn} onPress={() => setShowModal(true)}>

						<Text  style={styles.signOutBtnTxt}>Delete Account</Text>

					</TouchableOpacity>
					<TouchableOpacity style={styles.altBtn} onPress={()=>signOut()}>
						<Text style={styles.signUpBtnTxt}>Sign Out</Text>
					</TouchableOpacity>
				</View>
				
			</View>
        </View >
	)
}