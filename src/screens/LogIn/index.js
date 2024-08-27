import React, { useEffect, useState } from "react";
import { TouchableOpacity, TextInput, Alert,Text, View, KeyboardAvoidingView, ScrollView, Platform} from "react-native";


import {Auth} from 'aws-amplify';

import styles from "./styles";
import Spinner from 'react-native-loading-spinner-overlay';

export default function LogIn(props) {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [spinner, setSpinner] = useState(false);
	

	const login = () => {
		
    	let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$|(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#^])[a-zA-Z@$!%*?&#^]{8,}$|^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/
	
		if(email.length < 3 ){
			Alert.alert('Whoops!', 'Please enter a valid username');
		} else if(regPass.test(password) === false) {
			Alert.alert('Whoops!', 'Pasword must contrain 1 uppercase, 1 lowercase, 1 number, and one special character. 8 character minimum.');
		} else {
		
			setSpinner(true);

			Auth.signIn(email.toLocaleLowerCase(), password)

			.then((user) => {
				console.log("user: ", user);
				console.log('true'); 
			})

			.catch(err => {
				setSpinner(false);
				Alert.alert(	
					'Whoops!', 
					'Incorrect credentials',
					[{text: 'OK', onPress: ()=> setSpinner(false)}],
					{cancelable: false}
				);
			})
		}
	}

	const goToSignUp = () => {		
		props.navigation.navigate('SignUp');
	}

	const goToForgotPassword = () => {
		props.navigation.navigate('ForgotPassword');
	}

	return (
				
		<KeyboardAvoidingView keyboardVerticalOffset={60} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={styles.content}>
			<ScrollView style={{width: "100%", height: "100%" }} contentContainerStyle={{alignItems: "center", flex: 1}}>	
				<Spinner visible={spinner} />	

				<View style={styles.header}>			
					<Text style={styles.headerText}>Sign In To AccuPin</Text>
				</View>
				
				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Username *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder="Enter your username" 
						placeholderTextColor= "darkgray"					
						keyboardType="email-address" 
						value={email} 
						autoCapitalize="none" 
						onChangeText={(value) =>{console.log(value); setEmail(value);}}
					/>
				</View>

				<View style={styles.inputField}>
					<Text style={styles.inputTitle}>Password *</Text>
					<TextInput  style={styles.textInputField}  
						placeholder="Enter your password" 
						placeholderTextColor= "darkgray"					
						secureTextEntry = {true}
						value={password} 
						autoCapitalize="none" 
						onChangeText={(value) => setPassword(value)}
					/>
				</View>

				<TouchableOpacity style={styles.signBtn} onPress={()=>login()}>
					<Text style={styles.signBtnsTxt}>SIGN IN</Text>
				</TouchableOpacity>

				<View style={styles.altBtnField}>
					<TouchableOpacity style={styles.altBtn} onPress={()=>goToForgotPassword()}>
						<Text style={styles.forgotBtnTxt}>Forgot Password</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.altBtn} onPress={()=>goToSignUp()}>
						<Text style={styles.signUpBtnTxt}>Sign Up</Text>
					</TouchableOpacity>
				</View>

			</ScrollView>	

			<View style={styles.footer}>
				<Text style={styles.footerTxt}>AccuPin Version 5.8.9</Text>
			</View>

		</KeyboardAvoidingView>
    
	)
}