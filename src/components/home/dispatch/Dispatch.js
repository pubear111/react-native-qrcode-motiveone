import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Toast from 'react-native-easy-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';
import * as dispatchActions from '../../../redux/actions/dispatch';

class DispatchScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            dispatchStocks: [],
            dispatched: false
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => this.setState({ dispatchStocks: [], dispatched: false }, () => this.getDispatchStocks()))
    }

    getDispatchStocks() {
        let passData = this.props.navigation.getParam('dispatched', false)
        this.setState({ dispatched: passData })
        let temp = []
        for (let i = 0; i < this.props.dispatch_stocks.length; i++) {
            temp.push(JSON.parse(this.props.dispatch_stocks[i].value))
        }
        this.setState({ dispatchStocks: temp })
    }

    onAdd() {
        this.props.navigation.navigate('AssetQR2_Dispatch')
    }

    onDone() {
        this.refs.toast.show('Server connecting', 2000);
        fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/addDispatched', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dispatchStocks: this.state.dispatchStocks,
                driver: this.props.user.name,
                invoice: this.props.invoice
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 1) {
                    this.props.actions.resetDispatch()
                    if (this.props.navigation.state.params.route == 'DispatchError') {
                        this.props.navigation.pop(5)
                    } else {
                        this.props.navigation.pop(4)
                    }
                } else {
                    this.refs.toast.show('Please retry', 2000)
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }

    onHome() {
        this.props.actions.resetDispatch()
        if (this.props.navigation.state.params.route == 'DispatchError') {
            this.props.navigation.pop(5)
        } else {
            this.props.navigation.pop(4)
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
                    {
                        this.state.dispatched ?
                            <Text style={[STYLES.errorMessage, { marginTop: 5 }]}>THIS ITEM IS STILL DISPATCHED TO</Text>
                            :
                            <Text style={{ height: 0 }}></Text>
                    }
                    <Text></Text>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={STYLES.contentBody}>
                            {
                                this.state.dispatchStocks.map((stock, key) => (
                                    <CardView
                                        style={STYLES.cardView}
                                        cardElevation={3}
                                        cardMaxElevation={3}
                                        cornerRadius={5}
                                        key={key}>
                                        <Text>{stock.stock_serial}</Text>
                                        <Text>{stock.stock_description}</Text>
                                    </CardView>
                                ))
                            }
                            <View style={{ alignItems: 'center', marginTop: 10 }}>
                                <TouchableOpacity style={[STYLES.button_55, { backgroundColor: COLORS.button_blue }]} onPress={() => this.onAdd()}>
                                    <FontAwesome name='plus' size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
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
                        onPress={() => this.onDone()}>
                        <MaterialIcons name='check' size={40} color={COLORS.white} />
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

export default connect(mapStateToProps, mapDispatchToProps)(DispatchScreen)