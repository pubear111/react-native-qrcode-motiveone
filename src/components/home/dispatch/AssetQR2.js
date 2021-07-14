import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-easy-toast';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';
import * as dispatchActions from '../../../redux/actions/dispatch';

class AssetQR2Screen extends React.Component {

    constructor() {
        super();
        this.state = {
            flashLight: false,
        }
    }

    onSuccess(e) {

        let count = 0
        for (let i = 0; i < this.props.dispatch_stocks.length; i++) {
            if (JSON.parse(this.props.dispatch_stocks[i].value).stock_serial == e.data) {
                count++
            }
        }
        if (count > 0) {
            this.refs.toast.show('This qrcode was scanned already', 2000);
            setTimeout(() => { this.props.navigation.goBack() }, 3000);
        } else {
            fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/getStockDescription', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stock_serial: e.data
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success == 1) {

                        let stock = { stock_serial: e.data, stock_description: responseJson.data.stock_description }

                        if (responseJson.data.stock_onsite == 'no') {
                            this.props.actions.dispatchStock(JSON.stringify(stock))
                            this.props.navigation.navigate('DispatchError', {
                                asset: stock,
                                route: 'AssetQR2_Dispatch'
                            })
                        } else {
                            this.props.actions.dispatchStock(JSON.stringify(stock))
                            this.props.navigation.goBack()
                        }

                    } else {
                        this.refs.toast.show(responseJson.message, 2000);
                        setTimeout(() => { this.props.navigation.goBack() }, 3000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    onBack() {
        this.props.navigation.goBack()
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

    onSearch() {
        this.props.navigation.navigate('SearchSerial_Dispatch', {
            route: 'AssetQR2_Dispatch'
        })
    }

    onFlash() {
        this.setState({ flashLight: !this.state.flashLight })
    }

    render() {
        return (
            <QRCodeScanner
                showMarker
                onRead={this.onSuccess.bind(this)}
                ref={(node) => { this.scanner = node }}
                cameraStyle={{ height: DEVICES.screenHeight }}
                cameraProps={{ flashMode: this.state.flashLight ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off, captureAudio: false }}
                customMarker={
                    <View style={styles.rectangleContainer}>
                        <View style={styles.topOverlay}>
                            <View style={[STYLES.header_black, { paddingHorizontal: DEVICES.screenWidth * 0.05 }]}>
                                <Image source={require('../../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink, marginEnd: 10 }]}
                                        onPress={() => this.onBack()}>
                                        <MaterialIcons name='arrow-back' size={36} color={COLORS.white} />
                                    </TouchableOpacity>
                                    <Text style={STYLES.header_black_title}>{STRINGS.headers.scanAsset}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.leftAndRightOverlay} />
                            <View style={[styles.rectangle, { borderRadius: 5 }]}>
                                <Ionicons
                                    name='ios-qr-scanner'
                                    size={DEVICES.screenWidth * 0.73}
                                    color={COLORS.blue}
                                    style={{ opacity: 0 }} />
                                <Animatable.View
                                    style={styles.scanBar}
                                    direction='alternate-reverse'
                                    iterationCount='infinite'
                                    duration={10000}
                                    easing='linear'
                                    animation={this.makeSlideOutTranslation(
                                        'translateY',
                                        DEVICES.screenWidth * -0.7
                                    )} />
                            </View>
                            <View style={styles.leftAndRightOverlay} />
                        </View>

                        <View style={styles.bottomOverlay}>
                            <View style={STYLES.footerRight}>
                                <TouchableOpacity onPress={() => this.onSearch()}>
                                    <MaterialIcons name='search' size={36} color={COLORS.white} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.onFlash()}>
                                    {
                                        this.state.flashLight ?
                                            <MaterialIcons name='flash-off' size={36} color={COLORS.white} />
                                            :
                                            <MaterialIcons name='flash-on' size={36} color={COLORS.white} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Toast position='center' ref='toast' />
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
        backgroundColor: COLORS.overlayColor,
    },
    bottomOverlay: {
        flex: 1,
        height: DEVICES.screenWidth,
        width: DEVICES.screenWidth,
        backgroundColor: COLORS.overlayColor,
        paddingBottom: DEVICES.screenWidth * 0.25,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    leftAndRightOverlay: {
        height: DEVICES.screenWidth * 0.8,
        width: DEVICES.screenWidth * 0.1,
        backgroundColor: COLORS.overlayColor
    },

    scanBar: {
        width: DEVICES.screenWidth * 0.7,
        height: DEVICES.screenWidth * 0.0025,
        backgroundColor: COLORS.scanLine
    }
};

const mapStateToProps = state => {
    return {
        dispatch_stocks: state.dispatch.dispatch_stocks,
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(dispatchActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AssetQR2Screen)