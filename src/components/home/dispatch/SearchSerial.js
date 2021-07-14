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
import * as dispatchActions from '../../../redux/actions/dispatch';

class SearchSerial_DispatchScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            allStocks: [],
            searchStocks: []
        }
    }

    onSearchChange(text) {
        if (text.length > 2) {
            fetch('https://api.motiveone.com.au/motiveOne/mobileApi/actions/searchSerial', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serialFilter: text
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success == 1) {
                        if (responseJson.data.length == 0)
                            this.refs.toast.show('Search result is empty', 2000)
                        this.setState({ searchStocks: responseJson.data })
                    }
                })
                .catch((error) => { console.error(error) })
        }
    }

    onSelect(item) {

        let count = 0
        for (let i = 0; i < this.props.dispatch_stocks.length; i++) {
            if (JSON.parse(this.props.dispatch_stocks[i].value).stock_serial == item.stock_serial) {
                count++
            }
        }
        if (count > 0) {
            this.refs.toast.show('This stock was scanned already', 2000)
            setTimeout(() => { this.props.navigation.navigate('Dispatch') }, 2000)
        } else {
            let stock = { stock_serial: item.stock_serial, stock_description: item.stock_description }
            if (responseJson.data.stock_onsite == 'no') {
                this.props.navigation.navigate('Dispatch', {
                    dispatched: true
                })
            } else {
                this.props.actions.dispatchStock(JSON.stringify(stock))
                this.props.navigation.navigate('Dispatch')
            }
        }
    }

    onHome() {
        if (this.props.navigation.state.params.route == 'AssetQR1_Dispatch') {
            this.props.navigation.pop(4)
        } else {
            this.props.navigation.pop(6)
        }
    }

    onBack() {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_black}>
                    <Image source={require('../../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                    <Text style={STYLES.header_black_title}>{STRINGS.headers.searchSerial}</Text>
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
                                inputProps={{ keyboardType: 'number-pad' }}
                                textStyle={{ fontSize: 18 }}
                                iconCloseName='md-close-circle'
                                placeholder={'Search for serial'}
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
                                    this.state.searchStocks.map((item, key) => (
                                        <TouchableOpacity onPress={() => this.onSelect(item)}
                                            style={{ paddingHorizontal: 20, paddingVertical: 5 }}
                                            key={key}>
                                            <Text style={{ fontSize: 18 }}>{item.stock_serial}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </View>
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
                        onPress={() => this.onBack()}>
                        <MaterialIcons name='arrow-back' size={40} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Toast position='center' ref='toast' />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: DEVICES.screenHeight - getStatusBarHeight() - 150,
        flexDirection: 'column'
    }
});

const mapStateToProps = state => {
    return {
        dispatch_stocks: state.dispatch.dispatch_stocks,
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(dispatchActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchSerial_DispatchScreen)