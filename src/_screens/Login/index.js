import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert 
} from 'react-native';
import { Button } from 'react-native-elements';
import InputField from '~_components/Form/InputField';
import AsyncStorage from '@react-native-community/async-storage';
import { authActions, alertActions } from '~_store/_actions';
import { setToken } from '~_services/api.service';
import styles from './styles';

const LoginScreen = ({navigation}) => {

    // const { errorApiMessages } = useSelector( state => state.alert );
    const dispatch = useDispatch();
    const [ loginForm, setLoginForm ] = useState({
        email: '',
        password: '',
    });
    const [ errorMessages, setErrorMessages ] = useState([]);

    useEffect( () => {
        (async () => {
            // check if authenticated
            const token = await AsyncStorage.getItem('token');
            if ( token ) navigation.navigate('App') 
        })();
    }, []);

    const onChangeInput = (name, value) => {
        setLoginForm( data => ({
            ...data,
            [name]: value
        }));
    }

    const onLogin = async () => {
        try {

            await dispatch(alertActions.setScreenLoading(true));
            const { user, token } = await dispatch(authActions.login(loginForm));
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            await setToken();
            await dispatch(alertActions.setScreenLoading(false));
            console.log('ahaw')
            navigation.navigate('App');

        } catch ( err ) {
            if(err.response && err.response.status === 422) {
                setErrorMessages(err.response.data.errors);
                // dispatch({
                //     type: alertConstants.SET_ERROR_API_MESSAGE,
                //     payload: {
                //         login: err.response.data.errors
                //     }
                // })
            } else if (err.response && err.response.status === 404) {
                Alert.alert(
                    '',
                    err.response.data.message,
                );
            }
            await dispatch(alertActions.setScreenLoading(false));
        }
        
    }

    return (
        <View style={ styles.container }>
            <View style={{ marginHorizontal: 10 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
                    Login Page
                </Text>
            </View>
            <View style={{  }}>
                <InputField
                    name='email'
                    value={ loginForm.email }
                    placeholder='Email Address'
                    autoCapitalize='none'
                    errorMessage={ errorMessages.email }
                    onChangeText={ value => onChangeInput('email', value) }
                />
                <InputField
                    secureTextEntry={true}
                    name='password'
                    value={ loginForm.password }
                    placeholder='Password'
                    autoCapitalize='none'
                    errorMessage={ errorMessages.password }
                    onChangeText={ value => onChangeInput('password', value) }
                />
            </View>
            <Button 
                containerStyle={ styles.loginBtnContaniner }
                title='Login' 
                onPress={ () => onLogin() } 
            />
            <View>
                <Text style={ styles.navigateTextStyle }>
                    Don't have an account?
                </Text>
                <TouchableOpacity
                    onPress={  () => navigation.navigate('Registration') }
                >
                    <Text style={[ styles.navigateTextStyle, { color: '#3b99fc' } ]}>
                        Create an account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LoginScreen;