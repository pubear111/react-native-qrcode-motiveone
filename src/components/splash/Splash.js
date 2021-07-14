import AsyncStorage from '@react-native-community/async-storage';
import * as React from "react";
import { View } from "react-native";
import { connect } from 'react-redux';
import { settings } from '../../redux/actions/settings';
import { login } from '../../redux/actions/user';

class SplashScreen extends React.Component {

    constructor() {
        super();
        this.state = {}
    }

    componentWillMount() {
        this.autoLogin()
    }

    async autoLogin() {

        let settings = await AsyncStorage.getItem('@MotiveOne_settings')
        let user = await AsyncStorage.getItem('@MotiveOne_user')

        if (settings != null) {
            this.props.Settings(JSON.parse(settings).vibrate, JSON.parse(settings).beep)
        } else {
            this.props.Settings(true, true)
        }

        if (user == null) {
            this.props.navigation.navigate('Login')
        } else {
            if (JSON.parse(user).logged) {
                this.props.Login(JSON.parse(user).name, JSON.parse(user).role)
                this.props.navigation.navigate('Home')
            } else {
                this.props.navigation.navigate('Login')
            }
        }
    }

    render() {
        return (
            <View></View>
        );
    }
}

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        Login: (name, role) => { dispatch(login(name, role)); },
        Settings: (vibrate, beep) => { dispatch(settings(vibrate, beep)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);