import AsyncStorage from '@react-native-community/async-storage';
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Toast from 'react-native-easy-toast';
import QRCodeScanner from "react-native-qrcode-scanner";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from "react-native-vector-icons/Ionicons";
import { connect } from 'react-redux';
import COLORS from '../../config/Colors';
import DEVICES from '../../config/Devices';
import STRINGS from '../../config/Strings';
import STYLES from '../../config/Styles';
import { login } from '../../redux/actions/user';

class QRLoginScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            flag: true
        }
    }

    componentDidMount() {
        this.setState({ flag: true })
    }

    onSuccess(e) {
        if (e.data.startsWith('MotiveOne ')) {
            fetch('https://api.motiveone.com.au/motiveOne/mobileApi/driver/driverLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    token: e.data
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success == 1) {
                        this.saveDriver(responseJson.driver)
                    } else {
                        this.refs.toast.show(responseJson.message, 2000);
                        setTimeout(() => { this.scanner.reactivate() }, 3000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            this.refs.toast.show('QRcode is not valid for MotiveOne', 2000);
            setTimeout(() => {
                if (this.state.flag) {
                    this.scanner.reactivate()
                }
            }, 3000);
        }
    }

    async saveDriver(driver) {
        await AsyncStorage.setItem('@MotiveOne_user', JSON.stringify({
            name: driver.driver_name,
            role: 'driver',
            logged: true
        }))
        this.props.Login(driver.driver_name, 'driver')
        this.props.navigation.navigate('Home')
    }

    onBack() {
        this.setState({ flag: false }, () => this.props.navigation.goBack())
    }

    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: DEVICES.screenWidth * -0.05
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    render() {
        return (
            <QRCodeScanner
                showMarker
                onRead={this.onSuccess.bind(this)}
                ref={(node) => { this.scanner = node }}
                cameraStyle={{ height: DEVICES.screenHeight }}
                customMarker={
                    <View style={styles.rectangleContainer}>
                        <View style={styles.topOverlay}>
                            <View style={{ paddingHorizontal: DEVICES.screenWidth * 0.05, height: 120, backgroundColor: COLORS.bg_dark, flexDirection: 'row' }}>
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink }]} onPress={() => this.onBack()}>
                                        <AntDesign name='arrowleft' size={30} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <View style={{ zIndex: 10 }}>
                                        <Text style={{ fontSize: 32, fontFamily: 'NunitoSans-Bold', color: 'white', lineHeight: 35 }}>{STRINGS.headers.scanQR}</Text>
                                        <Text style={{ fontFamily: 'NunitoSans-Regular', color: 'white', marginTop: -5 }}>from Dashboard</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../../assets/images/qr-motiveone-qrLogin.png')} style={{ width: 100, height: 100, resizeMode: 'contain' }} />
                                </View>
                                <View style={styles.triangle} />
                            </View>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.leftAndRightOverlay} />
                            <View style={[styles.rectangle, { borderRadius: 5 }]}>
                                <Ionicons
                                    name="ios-qr-scanner"
                                    size={DEVICES.screenWidth * 0.73}
                                    color={COLORS.blue}
                                    style={{ opacity: 0 }} />
                                <Animatable.View
                                    style={styles.scanBar}
                                    direction="alternate-reverse"
                                    iterationCount="infinite"
                                    duration={10000}
                                    easing="linear"
                                    animation={this.makeSlideOutTranslation(
                                        "translateY",
                                        DEVICES.screenWidth * -0.7
                                    )} />
                            </View>
                            <View style={styles.leftAndRightOverlay} />
                        </View>

                        <View style={styles.bottomOverlay} />
                        <Toast position='center' ref="toast" />
                    </View>
                }
            />
        );
    }
}

const styles = {
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.transparent
    },
    rectangle: {
        height: DEVICES.screenWidth * 0.8,
        width: DEVICES.screenWidth * 0.8,
        borderWidth: DEVICES.screenWidth * 0.005,
        borderColor: COLORS.border_green,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.transparent
    },
    topOverlay: {
        flex: 1,
        height: DEVICES.screenWidth,
        width: DEVICES.screenWidth,
        backgroundColor: STYLES.overlayColor,
    },
    bottomOverlay: {
        flex: 1,
        height: DEVICES.screenWidth,
        width: DEVICES.screenWidth,
        backgroundColor: STYLES.overlayColor,
        paddingBottom: DEVICES.screenWidth * 0.25
    },
    leftAndRightOverlay: {
        height: DEVICES.screenWidth * 0.8,
        width: DEVICES.screenWidth * 0.1,
        backgroundColor: STYLES.overlayColor
    },
    scanBar: {
        width: DEVICES.screenWidth * 0.7,
        height: DEVICES.screenWidth * 0.0025,
        backgroundColor: COLORS.scanLine
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
};

const mapStateToProps = state => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        Login: (name, role) => { dispatch(login(name, role)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QRLoginScreen);