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
import * as returnedActions from '../../../redux/actions/returned';

class ReturnScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            returnStocks: [],
            customer_name: ''
        }
    }

    componentDidMount() {
        this.setState({ returnStocks: [] }, () => this.getReturnStocks())
    }

    getReturnStocks() {
        let temp = []
        for (let i = 0; i < this.props.returned_stocks.length; i++) {
            temp.push(JSON.parse(this.props.returned_stocks[i].value))
        }
        this.setState({ returnStocks: temp, customer_name: temp[0].customer_name })
    }

    onAdd() {
        this.props.navigation.navigate('AssetQR2_Return')
    }

    onDone() {
        this.refs.toast.show('Server connecting', 2000);
        fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/addReturned', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                returnedStocks: this.state.returnStocks,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 1) {
                    this.props.actions.resetReturned()
                    this.props.navigation.pop(2)
                } else {
                    this.refs.toast.show('Please retry', 2000);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onHome() {
        this.props.actions.resetReturned()
        this.props.navigation.pop(2)
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_black}>
                    <Image source={require('../../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                    <Text style={STYLES.header_black_title}>{STRINGS.headers.return}</Text>
                </View>
                <View style={STYLES.content}>
                    <Text style={styles.contentTitle}>{this.state.customer_name}</Text>
                    <View style={[STYLES.contentBody, { flex: 1 }]}>
                        <ScrollView>
                            <View style={{ padding: 5 }}>
                                {
                                    this.state.returnStocks.map((stock, key) => (
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
                                {/* <View style={{ alignItems: 'center', marginTop: 10 }}>
                                    <TouchableOpacity style={[STYLES.button_55, { backgroundColor: COLORS.button_blue }]} onPress={() => this.onAdd()}>
                                        <FontAwesome name='plus' size={20} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View> */}
                            </View>
                        </ScrollView>
                    </View>
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
                <Toast position='center' ref="toast" />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    contentTitle: {
        fontFamily: 'NunitoSans-Bold',
        fontSize: 24,
        color: COLORS.text_dark_51,
        alignSelf: 'center'
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
    },
    content_close_button: {
        backgroundColor: COLORS.button_pink
    },
    content_check_button: {
        backgroundColor: COLORS.button_green
    }
});

const mapStateToProps = state => ({
    returned_stocks: state.returned.returned_stocks
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(returnedActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReturnScreen)