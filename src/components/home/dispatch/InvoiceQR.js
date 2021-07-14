import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-easy-toast';
import QRCodeScanner from "react-native-qrcode-scanner";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';
import * as invoiceActions from '../../../redux/actions/invoice';

class InvoiceQR_DispatchScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            flashLight: false,
            flag: true
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => this.scanner.reactivate())
        this.setState({ flag: true })
    }

    onSuccess(e) {

        let params = e.data.split('*')

        if (params.length == 3) {
            this.props.actions.invoice(params[0], params[1], params[2])
            let scanInvoice = { customer_code: params[0], invoice_date: params[1], invoice_number: params[2] }
            this.props.navigation.navigate('AssetsWithCustomer_Dispatch', {
                scanResult: JSON.stringify(scanInvoice)
            })
        } else {
            this.refs.toast.show('Qrcode is not valid for invoice of MotiveOne', 2000);
            setTimeout(() => {
                if (this.state.flag) {
                    this.scanner.reactivate()
                }
            }, 3000);
        }
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

    onBack() {
        this.setState({ flag: false }, () => this.props.navigation.goBack())
    }

    onSearch() {
        this.props.navigation.navigate('SearchCustomer')
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
                                    <Text style={STYLES.header_black_title}>{STRINGS.headers.scanInvoice}</Text>
                                </View>
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

                        <View style={styles.bottomOverlay} >
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

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(invoiceActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceQR_DispatchScreen)
