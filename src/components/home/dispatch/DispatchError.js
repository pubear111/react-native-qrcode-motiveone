import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';
import * as dispatchActions from '../../../redux/actions/dispatch';

class DispatchErrorScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            dispatchedStock: {},
            customerName: ''
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => this.getDispatchedStock())
    }

    getDispatchedStock() {
        this.setState({ dispatchedStock: this.props.navigation.state.params.asset }, () => this.getCustomerName())
    }

    getCustomerName() {
        fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/searchDispatchedSerial', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serialFilter: this.state.dispatchedStock.stock_serial
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 1) {
                    this.setState({ customerName: responseJson.data[0].customer_name })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onNext() {
        this.refs.toast.show('Server connecting', 2000);
        fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/returnDispatched', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                returnedStock: this.state.dispatchedStock,
                customer_name: this.state.customerName
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 1) {
                    this.props.actions.dispatchStock(JSON.stringify(this.state.dispatchedStock))
                    this.props.navigation.navigate('Dispatch', {
                        route: 'DispatchError'
                    })
                } else {
                    this.refs.toast.show('Please retry', 2000);
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    onHome() {
        if (this.props.navigation.state.params.route == 'AssetQR1_Dispatch') {
            this.props.navigation.pop(4)
        } else {
            this.props.navigation.pop(6)
        }
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_black}>
                    <Image source={require('../../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                    <Text style={STYLES.header_black_title}>{STRINGS.headers.dispatch}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[STYLES.errorMessage, { marginVertical: 10 }]}>THIS ITEM IS STILL DISPATCHED TO</Text>
                    <Text style={[STYLES.errorMessage, { fontSize: 18, color: COLORS.black }]}>{this.state.customerName}</Text>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={STYLES.contentBody}>
                            <CardView
                                style={STYLES.cardView}
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={5}>
                                <Text>{this.state.dispatchedStock.stock_serial}</Text>
                                <Text>{this.state.dispatchedStock.stock_description}</Text>
                            </CardView>
                        </View>
                    </ScrollView>
                </View>
                <View style={STYLES.footer}>
                    <Image source={require('../../../assets/images/motiveone_bottombar.png')} style={{ position: 'absolute', left: -100 }} />
                    <View style={{ width: DEVICES.screenWidth, height: 60, backgroundColor: COLORS.bg_dark, position: 'absolute', right: -150 }} />
                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink, position: 'absolute', left: 52.5, top: -30 }]}
                        onPress={() => this.onHome()}>
                        <MaterialIcons name='home' size={45} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[STYLES.button_55, STYLES.footerButton]}
                        onPress={() => this.onNext()}>
                        <MaterialIcons name='arrow-forward' size={40} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Toast position='center' ref='toast' />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    header_inner: {
        width: DEVICES.screenWidth * 0.9,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_backButton: {
        backgroundColor: COLORS.button_pink
    },
    content: {
        flex: 1,
        flexDirection: 'column',
    },
    content_body: {
        width: DEVICES.screenWidth * 0.9,
        alignSelf: 'center',
        paddingBottom: 5
    },
    content_bottom: {
        height: 80,
        paddingHorizontal: DEVICES.screenWidth * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

const mapStateToProps = state => ({
    dispatch_stocks: state.dispatch.dispatch_stocks,
    user: state.user,
    invoice: state.invoice
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(dispatchActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DispatchErrorScreen)