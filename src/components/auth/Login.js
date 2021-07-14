import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { BackHandler, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import SwitchToggle from 'react-native-switch-toggle';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { connect } from 'react-redux';
import COLORS from '../../config/Colors';
import DEVICES from '../../config/Devices';
import STRINGS from '../../config/Strings';
import STYLES from '../../config/Styles';
import { login } from '../../redux/actions/user';

class LoginScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            rememberMe: true
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => BackHandler.addEventListener('hardwareBackPress', this.backPressed))
    }

    backPressed = () => {
        BackHandler.exitApp()
        return true;
    }

    onLogin() {
        if (this.state.email == '') {
            this.refs.toast.show('Email should not be empty', 2000);
        } else if (this.state.password == '') {
            this.refs.toast.show('Password should not be empty', 2000);
        } else {
            fetch('https://api.motiveone.com.au/motiveOne/mobileApi/driver/userLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success == 1) {
                        this.saveUser(responseJson.user)
                    } else {
                        this.refs.toast.show(responseJson.message, 2000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    async saveUser(user) {
        await AsyncStorage.setItem('@MotiveOne_user', JSON.stringify({
            name: user.user_name,
            role: 'user',
            logged: this.state.rememberMe
        }))
        this.props.Login(user.user_name, 'user')
        this.props.navigation.navigate('Home')
    }

    onQRLogin() {
        this.props.navigation.navigate('QRLogin')
    }

    onForgot() { }

    render() {
        return (
            <ScrollView>
                <View style={STYLES.container}>
                    <View style={styles.header}>
                        <Image source={require('../../assets/images/Motiveone_logo.png')} />
                        <View style={styles.triangle} />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.contentTitle}>{STRINGS.headers.login}</Text>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={COLORS.text_dark_151}
                            style={styles.textInput}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={this.state.email} />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={COLORS.text_dark_151}
                            style={styles.textInput}
                            onChangeText={(text) => this.setState({ password: text })}
                            value={this.state.password}
                            secureTextEntry={true} />
                        <View style={styles.loginView}>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <SwitchToggle
                                    switchOn={this.state.rememberMe}
                                    onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}
                                    backgroundColorOn={COLORS.button_blue}
                                    circleColorOn={COLORS.white} />
                                <Text style={styles.toggleText}>{STRINGS.buttons.rememberMe}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink }]}
                                    onPress={() => this.onLogin()}>
                                    <MaterialIcons name='check' size={35} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.divideView}>
                            <View style={styles.divideLine}></View>
                            <Text style={styles.divideText}>OR</Text>
                            <View style={styles.divideLine}></View>
                        </View>
                        <TouchableOpacity style={styles.qrLoginView} onPress={() => this.onQRLogin()}>
                            <Image source={require('../../assets/images/qr-motiveone-login.png')}></Image>
                            <Text style={styles.qrLoginText}>{STRINGS.buttons.qrLogin}</Text>
                        </TouchableOpacity>
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>V1.6</Text>
                            <TouchableOpacity onPress={() => this.onForgot()} style={{ display: 'none' }}>
                                <Text style={styles.footerText}>{STRINGS.buttons.forgotPassword}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Toast position='center' ref="toast" />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 150,
        backgroundColor: COLORS.bg_dark,
        alignItems: 'center',
        justifyContent: 'center'
    },
    triangle: {
        width: 40,
        height: 40,
        backgroundColor: COLORS.bg_dark,
        position: 'absolute',
        left: 20,
        bottom: -10,
        transform: [{ rotate: '45deg' }]
    },
    content: {
        flex: 1,
        paddingHorizontal: DEVICES.screenWidth * 0.05,
        paddingTop: 30
    },
    contentTitle: {
        fontSize: 25,
        fontFamily: 'NunitoSans-Black',
        color: COLORS.text_dark_26
    },
    textInput: {
        width: DEVICES.screenWidth * 0.85,
        height: 50,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
        marginTop: 15,
        paddingHorizontal: 10,
        fontSize: 17
    },
    loginView: {
        width: DEVICES.screenWidth * 0.85,
        height: 80,
        marginTop: 15,
        flexDirection: 'row'
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '400',
        fontFamily: 'NunitoSans-SemiBold',
        color: COLORS.text_dark_105,
        marginStart: 10,
        marginTop: 10
    },
    divideView: {
        width: DEVICES.screenWidth * 0.7,
        height: 60,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    divideLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#8A8787'
    },
    divideText: {
        fontSize: 15,
        fontFamily: 'NunitoSans-Regular',
        color: COLORS.text_dark_51,
        margin: 10
    },
    qrLoginView: {
        width: DEVICES.screenWidth * 0.85,
        height: 60,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrLoginText: {
        fontSize: 15,
        fontFamily: 'NunitoSans-Black',
        color: COLORS.text_dark_105,
        marginStart: 20
    },
    footer: {
        width: DEVICES.screenWidth * 0.9,
        height: 50,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        marginTop: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    footerText: {
        fontSize: 15,
        fontFamily: 'NunitoSans-SemiBold',
        color: COLORS.text_dark_105
    }
});

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        Login: (name, role) => { dispatch(login(name, role)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);