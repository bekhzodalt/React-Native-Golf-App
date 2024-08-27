import React, { Component, useEffect, useState, useContext} from "react";
import {Platform, ScrollView, TouchableOpacity, TextInput, Alert,Text, View, KeyboardAvoidingView} from "react-native";

import Spinner from 'react-native-loading-spinner-overlay';
import {Auth} from 'aws-amplify';

import styles from "./styles";
import Colors from '../../constants/Color';
import Images from '../../constants/Images';
import { UserContext } from '../../contexts/ContextManager';

export default function SignUp(props) {
	const [spinner, setSpinner] = useState(false);
	const {setUser} = useContext(UserContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPass, setConfirmPass] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [userName, setUserName] = useState('');

	let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	let regPass = /^(?=(.*[a-zA-Z].*){2,})(?=.*\d.*)(?=.*\W.*)[a-zA-Z0-9\S]{8,15}$/


	const onSignUp = () => {
		if(email.length == 0 || password.length == 0 || confirmPass.length == 0 || firstName.length == 0 || lastName.length == 0 ){
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
		} else if (email && regEmail.test(email) === false){
			Alert.alert(	
				'Whoops!', 
				'Please enter a valid email',
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
			signUp();
		}
	}

	const goToSignIn = () => {
		props.navigation.navigate('LogIn');	
		
	}

	const signUp = async () => {
		try {
			setSpinner(true);
			const success = await Auth.signUp({
				username: userName, 
				password: password, 
				attributes: {
					email: email, 
					family_name: lastName, 
					given_name: firstName
				}
			})
			setSpinner(false);
			console.log('user successfully signed up!: ', success);
			const via = success['codeDeliveryDetails']['DeliveryMedium'];
			const to = success['codeDeliveryDetails']['Destination'];
			console.log(via);
			Alert.alert(	
				'Sent', 
				"User is not confirmed and needs verification via " + via.toLowerCase() + " sent at " + to,
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

	return (

		<KeyboardAvoidingView keyboardVerticalOffset={60} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={styles.content}>
			<ScrollView style={{width: "100%", }} contentContainerStyle={{alignItems: "center"}}>	
		
				<Spinner visible={spinner} />
				<View style={styles.header}> 
					<Text style={styles.headerText}>Sign Up For AccuPin</Text>
				</View>
				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>First Name *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder="Enter your first name" 
						placeholderTextColor= "darkgray"					
						value={firstName} 
						onChangeText={(value) => setFirstName(value)}
					/>
				</View>

				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Last name *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder="Enter your last name" 
						placeholderTextColor= "darkgray"					
						value={lastName} 
						onChangeText={(value) => setLastName(value)}
					/>
				</View>

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
				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>User Name *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder="Enter your username" 
						placeholderTextColor= "darkgray"					
				
						value={userName} 
						autoCapitalize="none" 
						onChangeText={(value) => setUserName(value)}
					/>
				</View>

				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Password *</Text>
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

				<TouchableOpacity style={styles.signBtn} onPress={()=>onSignUp()}>
					<Text style={styles.signBtnsTxt}>SIGN UP</Text>
				</TouchableOpacity>
				
				<View style={styles.footer}>
					<TouchableOpacity style={styles.signInBtn} onPress={()=>goToSignIn()}>
						<Text style={styles.footerTxt}>  Already have an account?   </Text>
					</TouchableOpacity>
				</View>				
			</ScrollView>
		</KeyboardAvoidingView>

	)
}