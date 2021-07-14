import React from 'react';
import { Alert, BackHandler, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CardView from 'react-native-cardview';
import Toast from 'react-native-easy-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../config/Colors';
import DEVICES from '../../config/Devices';
import STRINGS from '../../config/Strings';
import STYLES from '../../config/Styles';

export default class HomeScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            searchCustomers: [],
            dynamicHeight: 50,
            keyword: ''
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', () => BackHandler.addEventListener('hardwareBackPress', this.backPressed))
        this.props.navigation.addListener('willBlur', () => BackHandler.removeEventListener('hardwareBackPress', this.backPressed))
    }

    backPressed = () => {
        this.getCurrentDate
        Alert.alert(
            'Exit MotiveOne',
            'Do you want to exit?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false });
        return true;
    }

    onSearchChange(text) {
        this.setState({ keyword: text })
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
                        if (responseJson.data.length == 0) {
                            this.refs.toast.show('Search result is empty', 2000)
                        } else {
                            this.setState({ dynamicHeight: 200, searchCustomers: responseJson.data })
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    onSelect(item) {
        this.setState({ dynamicHeight: 50, searchCustomers: [], keyword: '' }, () => this.props.navigation.navigate('AssetsWithCustomer', {
            customer_code: item.customer_code
        }))
    }

    onCamera() {
        this.props.navigation.navigate('InvoiceQR')
    }

    onDispatch() {
        this.props.navigation.navigate('InvoiceQR_Dispatch')
    }

    onReturn() {
        this.props.navigation.navigate('AssetQR_Return')
    }

    onSetting() {
        this.props.navigation.navigate('Setting')
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={styles.headerReturn}>
                    <View style={[styles.headerDispatch]}>
                        <View style={[styles.header, { position: 'absolute', top: 0 }]}>
                            <Image source={require('../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', top: -250, left: -50 }} />
                            <Text style={[styles.headerTitle, { position: 'absolute', top: 40, left: DEVICES.screenWidth * 0.05 }, styles.textShadow]}>{STRINGS.headers.home}</Text>
                        </View>
                        <View style={[styles.searchView, { position: 'absolute', top: 140 }]}>
                            <CardView
                                style={{ width: DEVICES.screenWidth * 0.7, height: this.state.dynamicHeight, backgroundColor: COLORS.white }}
                                cardElevation={10}
                                cardMaxElevation={10}
                                cornerRadius={5}>
                                <View style={{ flexDirection: 'row' }}>
                                    <MaterialIcons name='search' size={25} color={COLORS.border_112} style={{ marginStart: 10, marginVertical: 12.5 }} />
                                    <TextInput
                                        style={{ flex: 1, fontSize: 18, height: 50 }}
                                        placeholder={'Search customer'}
                                        value={this.state.keyword}
                                        onChangeText={(text) => this.onSearchChange(text)}
                                        onFocus={() => this.refs.toast.show('Search string must be at least 3 characters', 2000)}
                                        autoCorrect={false} >
                                    </TextInput>
                                </View>
                                <View style={{ maxHeight: 150 }}>
                                    <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 2 }}></View>
                                    <FlatList
                                        data={this.state.searchCustomers}
                                        renderItem={({ item }) =>
                                            <TouchableOpacity onPress={() => this.onSelect(item)}
                                                style={{ paddingHorizontal: 20, paddingVertical: 5 }}>
                                                <Text style={{ fontSize: 18 }}>{item.customer_name}</Text>
                                            </TouchableOpacity>
                                        }
                                        scrollEnabled={true}
                                        ItemSeparatorComponent={this.renderSeparator}
                                    />
                                </View>
                            </CardView>
                            <TouchableOpacity onPress={() => this.onCamera()}>
                                <FontAwesome name='camera' size={50} color={COLORS.white} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[styles.headerButtonBody, { position: 'absolute', top: 220 }]}
                            onPress={() => this.onDispatch()}>
                            <View>
                                <Text style={styles.headerButtonText}>{STRINGS.buttons.dispatch}</Text>
                                <Text style={styles.headerButtonSubText}>{STRINGS.buttons.dispatchDescription}</Text>
                            </View>
                            <Image source={require('../../assets/images/qr-motiveone-home.png')} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.headerButtonBody}
                        onPress={() => this.onReturn()}>
                        <View>
                            <Text style={styles.headerButtonText}>{STRINGS.buttons.return}</Text>
                            <Text style={styles.headerButtonSubText}>{STRINGS.buttons.returnDescription}</Text>
                        </View>
                        <Image source={require('../../assets/images/assignment_return.png')} style={{ marginRight: -10 }} />
                    </TouchableOpacity>
                </View>
                <View style={STYLES.content}></View>
                <View style={STYLES.footer}>
                    <Image source={require('../../assets/images/motiveone_bottombar.png')} style={{ position: 'absolute', left: -100 }} />
                    <View style={{ width: DEVICES.screenWidth, height: 60, backgroundColor: COLORS.bg_dark, position: 'absolute', right: -150 }} />
                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink, position: 'absolute', left: 52.5, top: -30 }]}
                        onPress={() => this.onSetting()}>
                        <MaterialIcons name='settings' size={40} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                <Toast position='center' ref="toast" />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    headerReturn: {
        height: 460,
        backgroundColor: COLORS.bg_pink,
        borderBottomLeftRadius: 60,
        elevation: 5,
        flexDirection: 'column'
    },
    headerDispatch: {
        height: 340,
        backgroundColor: COLORS.bg_blue,
        borderBottomLeftRadius: 60,
        elevation: 5,
        flexDirection: 'column'
    },
    header: {
        height: 220,
        width: DEVICES.screenWidth,
        backgroundColor: COLORS.bg_green,
        borderBottomLeftRadius: 60,
        elevation: 5
    },
    headerTitle: {
        fontSize: 40,
        fontFamily: 'NunitoSans-Black',
        color: COLORS.white,
        lineHeight: 45
    },
    searchView: {
        width: DEVICES.screenWidth * 0.9,
        marginHorizontal: DEVICES.screenWidth * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 5,
        backgroundColor: '#0000',
        zIndex: 10
    },
    headerButtonText: {
        fontSize: 32,
        fontFamily: 'NunitoSans-Bold',
        color: COLORS.white,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: -3, height: 3 },
        textShadowRadius: 10
    },
    headerButtonSubText: {
        fontSize: 14,
        fontFamily: 'NunitoSans-Regular',
        color: COLORS.white
    },
    headerButtonBody: {
        height: 120,
        width: DEVICES.screenWidth * 0.8,
        marginHorizontal: DEVICES.screenWidth * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: -3, height: 3 },
        textShadowRadius: 10
    }
});