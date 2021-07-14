import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Toast from 'react-native-easy-toast';
import SearchBar from 'react-native-material-design-searchbar';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import COLORS from '../../../config/Colors';
import DEVICES from '../../../config/Devices';
import STRINGS from '../../../config/Strings';
import STYLES from '../../../config/Styles';
import * as invoiceActions from '../../../redux/actions/invoice';

class SearchCustomerScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            searchCustomers: []
        }
    }

    onSearchChange(text) {

        if (text.length > 2) {
            fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/searchCustomer', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerFilter: text
                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success == 1) {
                        if (responseJson.data.length == 0)
                            this.refs.toast.show('Search result is empty', 2000)
                        this.setState({ searchCustomers: responseJson.data })
                    }
                })
                .catch((error) => { console.error(error) })
        }
    }

    onSelect(item) {
        let today = new Date();
        let currentDate = today.getDate() + '-' + parseInt(today.getMonth() + 1) + '-' + today.getFullYear();
        this.props.actions.invoice(item.customer_code, currentDate, '')
        let scanInvoice = { customer_code: item.customer_code, invoice_date: currentDate, invoice_number: '' }
        this.props.navigation.replace('AssetsWithCustomer_Dispatch', {
            scanResult: JSON.stringify(scanInvoice)
        })
    }

    onClose() {
        this.props.navigation.pop(2)
    }

    onBack() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_black}>
                    <Image source={require('../../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                    <Text style={STYLES.header_black_title}>{STRINGS.headers.searchCustomer}</Text>
                </View>
                <View style={styles.content}>
                    <View style={[STYLES.contentBody, { flex: 1 }]}>
                        <CardView
                            style={{ backgroundColor: COLORS.white }}
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={5}>
                            <SearchBar
                                height={50}
                                inputStyle={{ borderColor: COLORS.white }}
                                textStyle={{ fontSize: 18 }}
                                iconCloseName='md-close-circle'
                                placeholder={'Search for customer'}
                                autoCorrect={false}
                                padding={5}
                                returnKeyType={'done'}
                                onSearchChange={(text) => this.onSearchChange(text)}
                                onFocus={() => this.refs.toast.show('Search string must be at least 3 characters', 2000)}
                                onBlur={() => console.log('On Blur')}
                            />
                        </CardView>
                        <View style={{ flex: 1, marginTop: 10 }}>
                            <ScrollView>
                                {
                                    this.state.searchCustomers.map((item, key) => (
                                        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 5 }}
                                            onPress={() => this.onSelect(item)}
                                            key={key}>
                                            <Text style={{ fontSize: 18 }}>{item.customer_name}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View style={STYLES.footer}>
                    <Image source={require('../../../assets/images/motiveone_bottombar.png')} style={{ position: 'absolute', left: -100, top: 0 }} />
                    <View style={{ width: DEVICES.screenWidth, height: 60, backgroundColor: COLORS.bg_dark, position: 'absolute', right: -150, top: 0 }} />
                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink, position: 'absolute', left: 52.5, top: -30 }]}
                        onPress={() => this.onHome()}>
                        <MaterialIcons name='home' size={45} color={COLORS.white} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[STYLES.button_55, STYLES.footerButton]}
                        onPress={() => this.onBack()}>
                        <MaterialIcons name='arrow-back' size={40} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Toast position='top' ref='toast' />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: DEVICES.screenHeight - getStatusBarHeight() - 160,
        flexDirection: 'column'
    }
});

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(invoiceActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchCustomerScreen)