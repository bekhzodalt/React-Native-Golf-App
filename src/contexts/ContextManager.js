import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageBackground, Image, TouchableOpacity, Text, View, TouchableWithoutFeedback, Alert, DeviceEventEmitter, ScrollView } from "react-native";
export const UserContext = React.createContext();
import { Hub, Logger, StorageClass } from 'aws-amplify';
import IdentityFactory from '../factory/IdentityFactory';
const logger = new Logger('ContextManager');
import InvokeLambdaFunctionAPI from '../factory/InvokeLambdaFunctionAPI';
import VisageFunctionAPI from '../factory/VisageFunctionAPI';
import DeviceInfo from 'react-native-device-info';

const STORAGE_KEY = '@save_email'
const ContextManager = props => {
    const [user, setUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(undefined);

    const listener = data => {

        switch (data.payload.event) {
            case 'signIn':
                logger.debug('user signed in');
                initAuth();

                break;
            case 'signOut':
                logger.debug('user signed out');
                setUser(undefined);
                _removeUserData();
                break;
        }
    };

    _storeUserData = async (email) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, email)
        } catch (error) {
            console.log(error);
        }
    }

    _retrieveUserData = async () => {

        try {
            const email = await AsyncStorage.getItem(STORAGE_KEY)

            if (email !== null) {
                console.log("Stored User: ", email);

                setUser(email);
            }
        } catch (e) {
            console.log(e);
        }
    }

    _removeUserData = async () => {
        try {
            const result = await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.log(error);
        }
    }

    const initAuth = async () => {
        try {

            const { email, sub } = await IdentityFactory.getIdentity();

            _storeUserData(email);
            setUser(email);
        } catch (err) {
            logger.info('errx', err);
        }
    };

    useEffect(() => {

        if(global.listner1Count == 0){
            global.listner1Count = 1;
            DeviceEventEmitter.addListener("VisageAgain", (e) => {

                setTimeout(() => {
                    updateVisageAgain(e);
                }, 20000);
                
        
            });

            DeviceEventEmitter.addListener("PinUpdatedAgain", (e) => {

                setTimeout(() => {
                    console.log("\Successfully Updated");
            
                    console.log("Return Value: ", e);
        
                    const parentCourse = e.parentCourse;
                    const childCourse = e.childCourse;
                    const rotationType = e.rotationType;
                    const rotationNumber = e.rotation;
                    const pinNumber = e.pin;
                    const marker = e.rotationName.charAt(0);
        
                    const accuPinLati = e.customLati;
                    const accuPinLong = e.customLong;

                    const locationMethod = e.locationMethod;
                    const user = e.user;
        
                    console.log("marker: ", marker);
                    console.log("parentCourse: ", parentCourse);

                    let accuracy = e.accuracy;
                    
                    if(accuracy == 100){
                        accuracy = "";
                    }else {
                        accuracy = accuracy.toString();
                    }
                    console.log("Accuracy: ", accuracy);
        
                    getConfirmGPS(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker, accuPinLati, accuPinLong, locationMethod, accuracy, user);
                }, 3000);
                
        
            });
        }
        _retrieveUserData();
        init();
        return () => {
            Hub.remove('auth', listener);
        };
    }, []);

    const updateVisageAgain = async(e) => {
        console.log("\Visage Not Updated so will try again!");
      
        console.log("Return Value: ", e);

        const parentCourse = e.parentCourse;
        const childCourse = e.childCourse;
        const rotationType = e.rotationType;
        const rotation = e.rotation;
        const pin = e.pin;

        const tempRotationName = e.tempRotationName;
        const distance = e.distance;
        const front = e.front;
        const back = e.back;
        const left = e.left;
        const right = e.right;

        const customLati = e.customLati;
        const customLong = e.customLong;
        
        const result = await VisageFunctionAPI.updateVisageAPI(parentCourse, childCourse, pin, rotation, rotationType, tempRotationName, distance, front, back, left, right, customLati, customLong)
        console.log("try again result: ");
        console.log(result);
    }

    const getConfirmGPS = async(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker, accuPinLati, accuPinLong, locationMethod, accuracy, user) => {
		try {
			const result =await VisageFunctionAPI.getConfirmGPSAPI(parentCourse, childCourse, rotationType, rotationNumber, pinNumber, marker);
		
			if(result.hasOwnProperty("success")){
				const data = result.data;
				

				console.log("data: ", data);

				const visageLati = data.Latitude;
				const visageLong = data.Longitude;

				console.log("visageLati: ", Number(visageLati));
				console.log("accuPinLati: ", accuPinLati);

				let method = "G";
				if(locationMethod == "ble"){
					method = "B";
				}else if(locationMethod == "finger"){
					method = "F";
				}
              
				console.log("user: ", user);
				console.log("Method: ", method);

				const emailStr = user.substring(0, 3);

				console.log("email: ", emailStr);
				let version = DeviceInfo.getVersion();
				console.log("app version: ", version);

				if(Number(accuPinLati) == Number(visageLati)){
				
					const content = "success";
					const recipientEmails = [
						"dev.nate116@gmail.com",
					];
					console.log("Accuracy1: ", accuracy);
					InvokeLambdaFunctionAPI.sendConfirmEmailAPI(parentCourse, childCourse, marker, pinNumber, recipientEmails, content, method, emailStr, version, accuracy);
				} else {
				
					const content = "nosuccess";
					const recipientEmails = [
						"dev.nate116@gmail.com",
					];
					InvokeLambdaFunctionAPI.sendConfirmEmailAPI(parentCourse, childCourse, marker, pinNumber, recipientEmails, content, method, emailStr, version, accuracy);
				}
			}

		} catch (err){
			console.log(err);
		}
	}

    const init = async () => {
        setIsLoading(false);
        Hub.listen('auth', listener);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                userInfo,
                setUserInfo
            }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default ContextManager;
