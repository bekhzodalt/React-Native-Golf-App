import React, { Component, useEffect, useState, useContext} from "react";
import {ImageBackground, Image, TouchableOpacity, TextInput, Alert,Text, View,} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Auth} from 'aws-amplify';
import { StackActions } from '@react-navigation/native';
import styles from "./styles";
import Colors from '../../constants/Color';
import Images from '../../constants/Images';
import { UserContext } from '../../contexts/ContextManager';

export default function ResetPassword(props) {
	const [spinner, setSpinner] = useState(false);
	const { email } = props.route.params;
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [code, setCode] = useState('');
	
	let regPass = /^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/


	const onResetBtn = () => {
		if(code.length == 0 || password.length == 0 || confirmPass.length == 0 ){
			Alert.alert(	
				'Whoops!', 
				'You must enter all fields',
				[{text: 'OK', onPress: ()=> setSpinner(false)}],
				{cancelable: false}
			);
		} else if( confirmPass != password ){
			Alert.alert(	
				'Whoops!', 
				'Passwords must match',
				[{text: 'OK', onPress: ()=> setSpinner(false)}],
				{cancelable: false}
			);
		} else if (regPass.test(password) === false ){
			Alert.alert(
				'Whoops!', 
				'Pasword must contrain 1 uppercase, 1 lowercase, 1 number, and one special character. 8 character minimum.',
				[{text: 'OK', onPress: ()=> setSpinner(false)}],
				{cancelable: false}
			);
		} else {
			console.log("Possible to sign up");
			resetPassowrd();
		}
	}

	const resetPassowrd = async () => {
		try {
			setSpinner(true);
			const success = await Auth.forgotPasswordSubmit(email, code, password);
			console.log('password successfully updated!: ', success);
			setSpinner(false);
			Alert.alert(	
				'Success!', 
				'Successfully updated',
				[{text: 'OK', onPress: ()=> goToSignIn()}],
				{cancelable: false}
			);
			
			
		} catch (err){
			setSpinner(false);
			console.log(err);
			Alert.alert(	
				'Whoops!', 
				err['message'],
				[{text: 'OK', onPress: ()=> console.log("Error")}],
				{cancelable: false}
			);

		}
	}

	const goToSignIn = () => {
		const popAction = StackActions.pop(2);
		props.navigation.dispatch(popAction);
	}

	return (
			
		<View style={styles.content}>
			<Spinner visible={spinner} />	
			<View style={styles.inputField}>
				<Text style={styles.inputTitle}>Confirmation Code *</Text>
				<TextInput  style={styles.textInputField}  
					placeholder="Enter confirmation code" 
					placeholderTextColor= "darkgray"					
					value={code} 
					keyboardType = 'numeric'
					onChangeText={(value) => setCode(value)}
				/>
			</View>

			<View style={styles.inputField}>
				<Text style={styles.inputTitle}>New Password *</Text>
				<TextInput  style={styles.textInputField}  
					placeholder="Enter your password" 
					placeholderTextColor= "darkgray"					
					secureTextEntry = {true}
					value={password} 
					onChangeText={(value) => setPassword(value)}
				/>
			</View>

			<View style={styles.inputField}>
				<Text style={styles.inputTitle}>Confirm Password *</Text>
				<TextInput  style={styles.textInputField}  
					placeholder="Enter confirm password" 
					placeholderTextColor= "darkgray"					
					secureTextEntry = {true}
					value={confirmPass} 
					autoCapitalize="none" 
					onChangeText={(value) => setConfirmPass(value)}
				/>
			</View>

			<TouchableOpacity style={styles.signBtn} onPress={()=>onResetBtn()}>
				<Text style={styles.signBtnsTxt}>Reset</Text>
			</TouchableOpacity>
					
		</View>
 
	)
}