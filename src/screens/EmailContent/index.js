import React, { Component, useEffect, useState, useContext, useCallback} from "react";
import {Platform , Button, TouchableOpacity, Text, View , FlatList, Alert} from "react-native";

import Moment from 'moment';

import styles from "./styles";

import InvokeLambdaFunctionAPI from '../../factory/InvokeLambdaFunctionAPI';

export default function EmailContent(props) {

	const {
		parentCourse,
		childCourse,
		pinSummaryList,
		rotationName
	} =  props.route.params;

	const [pinList, setPinList] = useState();


	useEffect(()=>{
		
		console.log("Pin Summary List", pinSummaryList);
		configureContent();
		
	},[]);

	const configureContent = () => {
		
		const lastDateStr = pinSummaryList[0].lastUpdate.substring(0, 10);
		pinSummaryList.sort((a, b) => a.lastUpdate < b.lastUpdate ? -1: 1);
		const tempSummaryList = [];
		pinSummaryList.map((item) => {
			
			if(item.lastUpdate.includes(lastDateStr)){
				lastUpdate = item.lastUpdate,
				lastUpdate = Moment(lastUpdate).format('MM-DD hh:mm A');
				lastUpdate = lastUpdate.substring(6);


				frontBack = getFrontBackString(item);
				leftRight = getLeftRightString(item);

				const tempItem = {
					pin_number: item.pinId,
					last_update: lastUpdate,
					front_back: frontBack,
					left_right: leftRight,
					rotation: rotationName
				}
				tempSummaryList.push(tempItem);
			}
		})

		console.log("tempSummaryList", tempSummaryList);
		setPinList(tempSummaryList);
	}

	const getFrontBackString = (item) => {
		var retrunValue = ''
		if(Number(item.up) == 0){
			retrunValue = item.down + 'F';
		} else {
			retrunValue = item.up + 'B';
		}
		return retrunValue;
	}

	const getLeftRightString = (item) => {
		var retrunValue = ''
		if(Number(item.right) == 0){
			retrunValue = item.left + 'L';
		} else {
			retrunValue = item.right + 'R';
		}
		return retrunValue;
	}

	const onContinue = () => {
		props.navigation.navigate('EmailList', {
			parentCourse: parentCourse,
			childCourse: childCourse,
			pinList: pinList,
			rotationName: rotationName
		});
	}

	const renderItem = useCallback( ({item, index}) =>     
		<TouchableOpacity
			style={styles.itemBlock}
			key={index}>
				<Text style={{marginLeft: 15, flex: 0.6, paddingLeft: 10, paddingTop: 10, alignSelf:'center', justifyContent: 'center', alignContent:'center'}}>{item.pin_number}</Text>
				<Text style={{alignSelf: 'stretch', flex: 1.3, paddingLeft: 10, paddingTop: 10}}>{item.last_update}</Text>
				<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10}}>{item.front_back}</Text>
				<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10}}>{item.left_right}</Text>
				<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 20, paddingTop: 10}}>{item.rotation}</Text>

		</TouchableOpacity>,
		[]
	);
	const keyExtractor = useCallback((item, index) => index.toString(), [])

	return (
		<View style={styles.container}>			

			<View style={styles.header}>
				<Text style={styles.headerText}>{childCourse}</Text>
			
				<Text style={styles.rotationText}>Rotation: {rotationName}</Text>		
			</View>
			
			<View style={{marginTop: 30, height: '60%', width: '95%', justifyContent: "center", borderColor: 'gray', borderWidth: 1}}>
				<View style={styles.tlbHeader}>
					<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10,}}>Hole</Text>
					<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10,}}>Time</Text>
					<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10,}}>F/B</Text>
					<Text style={{alignSelf: 'stretch', flex: 1, paddingLeft: 10, paddingTop: 10,}}>L/R</Text>
					<Text style={{alignSelf: 'stretch', flex: 1.1, paddingLeft: 10, paddingTop: 10,}}>Rotation</Text>
					
				</View>
				<View  style={styles.content}>
					<FlatList
						style={styles.historyContent}
						data={pinList}
						renderItem={renderItem}
						keyExtractor={keyExtractor}
						extraData={pinList}
					/>
				</View >
			</View>	

			<View style={styles.btn}>
				<TouchableOpacity style={styles.signBtn} onPress={()=>onContinue()}>
					<Text style={styles.signBtnsTxt}>Continue</Text>
				</TouchableOpacity>
			</View>	
				
		
        </View >
	)
}