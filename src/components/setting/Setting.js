import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Image, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import SwitchToggle from 'react-native-switch-toggle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import COLORS from '../../config/Colors';
import DEVICES from '../../config/Devices';
import STRINGS from '../../config/Strings';
import STYLES from '../../config/Styles';
import { settings } from '../../redux/actions/settings';
import { logout } from '../../redux/actions/user';

class SettingScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            vibrate: true,
            beep: true,
            avatarSource: require('../../assets/images/user_silhouette.png')
        }
    }

    componentDidMount() {
        this.initSettings()
    }

    async initSettings() {
        let settings = await AsyncStorage.getItem('@MotiveOne_settings')
        if (settings == null) {
            await AsyncStorage.setItem('@MotiveOne_settings', JSON.stringify({
                vibrate: this.state.vibrate,
                beep: this.state.beep,
            }))
        } else {
            this.setState({ vibrate: JSON.parse(settings).vibrate, beep: JSON.parse(settings).beep })
        }

        let avatar = await AsyncStorage.getItem('@MotiveOne_avatar')
        if (avatar != null) {
            this.setState({ avatarSource: JSON.parse(avatar) })
        }
    }

    onTakePicture() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
            },
        };

        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = { uri: response.uri };

                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                }, () => this.saveAvatar(source));
            }
        });
    }

    async saveAvatar(source) {
        await AsyncStorage.setItem('@MotiveOne_avatar', JSON.stringify(source))
    }

    onSignout = async () => {
        await AsyncStorage.removeItem('@MotiveOne_user')
        this.props.Logout()
        this.props.navigation.navigate('Login')
    }

    async onHome() {
        await AsyncStorage.mergeItem('@MotiveOne_settings', JSON.stringify({
            vibrate: this.state.vibrate,
            beep: this.state.beep,
        }))
        this.props.Settings(this.state.vibrate, this.state.beep)
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={STYLES.container}>
                <View style={STYLES.header_black}>
                    <Image source={require('../../assets/images/qr_motiveone.png')} style={{ position: 'absolute', left: -120, top: -320 }} />
                    <Text style={STYLES.header_black_title}>{STRINGS.headers.settings}</Text>
                </View>
                <View style={[STYLES.content, { paddingHorizontal: DEVICES.screenWidth * 0.05 }]}>
                    <View style={styles.avatarView}>
                        <View style={styles.avatarImageView}>
                            <Image source={this.state.avatarSource} style={{ width: 120, height: 120, resizeMode: 'cover' }} />
                        </View>
                        <View style={styles.usernameView}>
                            <Text style={styles.username}>{this.props.user.name}</Text>
                            <TouchableOpacity onPress={() => this.onTakePicture()}>
                                <FontAwesome name='camera' size={50} color={COLORS.border_112} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingView}>
                        <View style={styles.settingViewHalf}>
                            <View style={styles.settingViewHalfLeft}>
                                <Text style={styles.settingText}>{STRINGS.settings.vibrate}</Text>
                                <Text style={styles.settingSubText}>{STRINGS.settings.vibrate_description}</Text>
                            </View>
                            <View style={styles.settingViewHalfRight}>
                                <SwitchToggle
                                    switchOn={this.state.vibrate}
                                    onPress={() => this.setState({ vibrate: !this.state.vibrate })}
                                    backgroundColorOn={COLORS.button_blue}
                                    circleColorOn={COLORS.white}
                                />
                            </View>
                        </View>
                        <View style={[styles.settingViewHalf, { display: 'none' }]}>
                            <View style={styles.settingViewHalfLeft}>
                                <Text style={styles.settingText}>{STRINGS.settings.beep}</Text>
                                <Text style={styles.settingSubText}>{STRINGS.settings.beep_description}</Text>
                            </View>
                            <View style={styles.settingViewHalfRight}>
                                <SwitchToggle
                                    switchOn={this.state.beep}
                                    onPress={() => this.setState({ beep: !this.state.beep })}
                                    backgroundColorOn={COLORS.button_blue}
                                    circleColorOn={COLORS.white}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.restView}>
                        <TouchableOpacity style={styles.signoutButton} onPress={this.onSignout}>
                            <Text style={styles.signoutText}>{STRINGS.buttons.signout}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={STYLES.footer}>
                    <Image source={require('../../assets/images/motiveone_bottombar.png')} style={{ position: 'absolute', left: -100 }} />
                    <View style={{ width: DEVICES.screenWidth, height: 60, backgroundColor: COLORS.bg_dark, position: 'absolute', right: -150 }} />
                    <TouchableOpacity style={[STYLES.button_60, { backgroundColor: COLORS.button_pink, position: 'absolute', left: 52.5, top: -30 }]}
                        onPress={() => this.onHome()}>
                        <MaterialIcons name='home' size={45} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    avatarView: {
        marginTop: 20,
        flexDirection: 'row'
    },
    avatarImageView: {
        padding: 5,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: COLORS.border_112,
        borderRadius: 5
    },
    usernameView: {
        flex: 1,
        paddingStart: 20,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    username: {
        fontSize: 24,
        fontFamily: 'NunitoSans-ExtraBold',
        color: COLORS.text_dark_51,
        marginBottom: 10
    },
    settingView: {
        height: 120,
        marginTop: 20,
        flexDirection: 'column'
    },
    settingViewHalf: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingViewHalfLeft: {
        flex: 2,
        flexDirection: 'column'
    },
    settingViewHalfRight: {
        flex: 1,
        alignItems: 'flex-end',
        paddingEnd: 20
    },
    settingText: {
        fontSize: 24,
        fontFamily: 'NunitoSans-Bold',
        color: COLORS.text_dark_51
    },
    settingSubText: {
        fontSize: 12,
        fontFamily: 'NunitoSans-SemiBold',
        color: COLORS.text_dark_151
    },
    restView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    signoutButton: {
        width: 82,
        height: 34,
        backgroundColor: COLORS.button_pink,
        borderRadius: 17,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    signoutText: {
        fontSize: 12,
        fontFamily: 'NunitoSans-ExtraBold',
        color: COLORS.white
    }
});

const mapStateToProps = state => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        Logout: () => { dispatch(logout()); },
        Settings: (vibrate, beep) => { dispatch(settings(vibrate, beep)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);