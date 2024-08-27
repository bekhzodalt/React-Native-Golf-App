import React, { Component, useEffect, useState, useContext} from "react";
import { TouchableOpacity, TextInput, Alert,Text, View,} from "react-native";


import {Auth} from 'aws-amplify';

import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';

export default function ForgotPassword(props) {

	const [email, setEmail] = useState('');
	const [spinner, setSpinner] = useState(false);
	

	const onContinue = () => {
		let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    	

		if(email.length < 8 || (email && regEmail.test(email) === false)){
			Alert.alert('Whoops!', 'Please enter a valid email');
		} else {
			getForgotPassword();
			
		}
	}

	const getForgotPassword = async () => {
		setSpinner(true);
		try {
			console.log("start");
			const success = await Auth.forgotPassword(email);
			setSpinner(false);
			const via = success['CodeDeliveryDetails']['DeliveryMedium'];
			const to = success['CodeDeliveryDetails']['Destination'];
			console.log(via);
			Alert.alert(	
				'Sent', 
				"Confirmation code sent via " + via.toLowerCase() + " to: " + to,
				[{text: 'OK', onPress: ()=> goToResetPassword()}],
				{cancelable: false}
			);
		} catch (error) {
			setSpinner(false);
			console.log(error);
		}
	}

	const goToResetPassword = () => {
		props.navigation.navigate('ResetPassword', {
			email: email		
		});
	}

	return (
		<View style={styles.content}>
			<Spinner visible={spinner} />
			<View style={styles.inputField}>
				<Text style={styles.inputTitle}>Email *</Text>
				<TextInput  style={styles.textInputField}  
					placeholder="Enter your email" 
					placeholderTextColor= "darkgray"					
					keyboardType="email-address" 
					value={email} 
					autoCapitalize="none" 
					onChangeText={(value) => setEmail(value)}
				/>
			</View>

			<TouchableOpacity style={styles.signBtn} onPress={()=>onContinue()}>
				<Text style={styles.signBtnsTxt}>Continue</Text>
			</TouchableOpacity>
		</View>
	)
}