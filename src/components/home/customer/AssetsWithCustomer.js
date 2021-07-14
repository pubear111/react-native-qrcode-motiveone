import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Toast from 'react-native-easy-toast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';

export default class AssetsWithCustomerScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            customer_name: 'Customer Name',
            dispatched: [],
            inActivate: false
        }
    }

    componentDidMount() {
        let customer_code = this.props.navigation.getParam('customer_code', 'default');
        if (customer_code != 'default') {
            this.getDispatched(customer_code)
        }
    }

    getDispatched(customer_code) {
        this.refs.toast.show('Server Connecting');
        fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/getDispatched', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_code: customer_code
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 1) {
                    let temp = []
                    for (let i = 0; i < responseJson.data.length; i++) {
                        temp.push({ stock_serial: responseJson.data[i].stock_serial, stock_description: responseJson.data[i].stock_description })
                    }
                    this.setState({ customer_name: responseJson.customer, dispatched: temp })
                } else {
                    this.refs.toast.show(responseJson.message);
                    this.setState({ inActivate: true })
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onHome() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_white}>
                    <Text style={STYLES.header_white_title}>{this.state.customer_name}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'NunitoSans-Bold' }}>{STRINGS.headers.assetsWithCustomer}</Text>
                        <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_green, alignSelf: 'center' }]}>
                            <Text style={{ fontSize: 40, fontFamily: 'NunitoSans-ExtraBold', color: COLORS.white }}>{this.state.dispatched.length}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={STYLES.content}>
                    {
                        this.state.inActivate ?
                            <Text style={STYLES.errorMessage}>Customer is not setup for asset tracking {'\n'}Please contact the office</Text>
                            :
                            <Text style={{ height: 0 }}></Text>
                    }
                    <ScrollView style={styles.contentBody}>
                        <View style={{ padding: 5 }}>
                            {this.state.dispatched.map((item, key) => (
                                <CardView
                                    style={STYLES.cardView}
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={5}
                                    key={key}>
                                    <Text>{item.stock_serial}</Text>
                                    <Text>{item.stock_description}</Text>
                                </CardView>
                            ))}
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
                </View>
                <Toast position='center' ref="toast" />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    contentBody: {
        flex: 1,
        paddingHorizontal: DEVICES.screenWidth * 0.05,
        marginTop: 10,
        marginBottom: 50
    },
});