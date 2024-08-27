import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from 'react-native-splash-screen';
import 'react-native-gesture-handler';

import { UserContext } from './contexts/ContextManager';
import LogIn from './screens/LogIn';
import SignUp from './screens/SignUp';
import ClubSelection from './screens/ClubSelection';
import CourseSelection from './screens/CourseSelection';
import SelectMode from './screens/SelectMode';
import RotationSelection from './screens/RotationSelection';
import RotationEventSelection from './screens/RotationEventSelection';
import LocationMethod from './screens/LocationMethod';
import PinSelection from './screens/PinSelection';
import EnterCoordinates from './screens/EnterCoordinates';
import EnterCoordinateCompare from './screens/EnterCoordinateCompare';
import EnterCoordinateBLE from './screens/EnterCoordinateBLE';
import EnterCoordinateBLECompare from './screens/EnterCoordinateBLECompare';
import ConfirmPlacement from './screens/ConfirmPlacement';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import Summary from './screens/Summary';
import EmailContent from './screens/EmailContent';
import EmailList from './screens/EmailList';
import HistoryEmailList from './screens/HistoryEmailList';
import NonVisageSelectMode from './screens/NonVisageSelectMode';
import NonRotationSelection from './screens/NonRotationSelection';
import NonRotationEventSelection from './screens/NonRotationEventSelection';
import NonSettingScreen from './screens/NonSettingScreen';
import NonEventSetting from './screens/NonEventSetting';
import NonRotationSetting from './screens/NonRotationSetting';
import NonEventSelection from './screens/NonEventSelection';

import RotationListScreen from './screens/RotationListScreen';

const Stack  = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator >
        <Stack.Screen name="LogIn" component={LogIn} options={{headerShown: false}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{title:'Sign Up', headerTitleAlign: 'center', headerBackTitle: 'Back'}}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}  options={{title:'Forgot Password', headerTitleAlign: 'center', headerBackTitle: 'Back'}}/>
        <Stack.Screen name="ResetPassword" component={ResetPassword}  options={{title:'Reset Password', headerTitleAlign: 'center', headerBackTitle: 'Back'}}/>
    </Stack.Navigator>
);
const MainStack = ({user}) => (
    <Stack.Navigator initialRouteName="ClubSelection">
        <Stack.Screen name="ClubSelection" component={ClubSelection} options={{title:'Clubs', headerTitleAlign: 'center'}} initialParams={user}/>
        <Stack.Screen name="CourseSelection" component={CourseSelection} options={{title:'Courses', headerBackTitle: 'Back', headerTitleAlign: 'center'}} initialParams={user}/>
        <Stack.Screen 
            name="SelectMode" 
            component={SelectMode} 
            options= {{
                title:'Pin Choices',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />
        <Stack.Screen 
            name="RotationListScreen" 
            component={RotationListScreen} 
            options= {{
                title:'Pin Choices',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />
        <Stack.Screen 
            name="NonVisageSelectMode" 
            component={NonVisageSelectMode} 
            options= {{
                title:'AccuCaddie Pins',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />
        <Stack.Screen 
            name="RotationSelection" 
            component={RotationSelection} 
            options= {{
                title:'Pin Selection',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'
            }}
        />
        <Stack.Screen 
            name="RotationEventSelection" 
            component={RotationEventSelection} 
            options= {{
                title:'Pin Set Selection',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'
            }}
        />
        <Stack.Screen 
            name="NonRotationSelection" 
            component={NonRotationSelection} 
            options= {{
                title:'Pin Set Selection',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'
            }}
        />
        <Stack.Screen 
            name="NonRotationEventSelection" 
            component={NonRotationEventSelection} 
            options= {{
                title:'Pin Set Selection',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'
            }}
        />
        <Stack.Screen 
            name="NonSettingScreen" 
            component={NonSettingScreen} 
            options= {{
                title:'',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />

        <Stack.Screen 
            name="NonEventSetting" 
            component={NonEventSetting} 
            options= {{
                title:'AccuCaddie Pins',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />

        <Stack.Screen 
            name="NonRotationSetting" 
            component={NonRotationSetting} 
            options= {{
                title:'Pin Set Selection',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />
        <Stack.Screen 
            name="NonEventSelection" 
            component={NonEventSelection} 
            options= {{
                title:'Pin Options',
                headerBackTitle: 'Back',
                headerTitleAlign: 'center'               
            }}
        />
       
        <Stack.Screen name="LocationMethod" component={LocationMethod} options={{title:'Location Method', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="PinSelection" component={PinSelection} options={{title:'Green Selection', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EnterCoordinates" component={EnterCoordinates} options={{title:'Enter Coordinates', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EnterCoordinateCompare" component={EnterCoordinateCompare} options={{title:'Enter Coordinates', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EnterCoordinateBLE" component={EnterCoordinateBLE} options={{title:'Enter Coordinates', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EnterCoordinateBLECompare" component={EnterCoordinateBLECompare} options={{title:'Enter Coordinates', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="ConfirmPlacement" component={ConfirmPlacement} options={{title:'Confirm Placement', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EmailContent" component={EmailContent} options={{title:'Email Content', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="EmailList" component={EmailList} options={{title:'Email List', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="HistoryEmailList" component={HistoryEmailList} options={{title:'Email List', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
        <Stack.Screen name="Summary" component={Summary} options={{title:'Summary', headerBackTitle: 'Back', headerTitleAlign: 'center'}}/>
    </Stack.Navigator>
)

export default () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const {user, userInfo} = useContext(UserContext);
    
    React.useEffect(() => {

        setTimeout(() => {
            setIsLoading(!isLoading);    
            SplashScreen.hide();        
        }, 10000);

    }, []);

    return (
        <NavigationContainer>   
        {
            isLoading ? 
                <>
                </>                     
            : 
                user ?                   
                <MainStack user = {user}/>     
                : 
                <AuthStack/>     
        } 
        </NavigationContainer>
    );
};