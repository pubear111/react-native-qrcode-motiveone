import COLORS from './Colors';
import DEVICES from './Devices';

const styles = {
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        flexDirection: 'column'
    },
    header_black: {
        height: 100,
        backgroundColor: COLORS.bg_dark,
        paddingHorizontal: DEVICES.screenWidth * 0.1,
        justifyContent: 'center'
    },
    header_black_title: {
        fontSize: 24,
        fontFamily: 'NunitoSans-ExtraBold',
        color: COLORS.white
    },
    header_white: {
        height: 100,
        paddingHorizontal: DEVICES.screenWidth * 0.05,
        flexDirection: 'column'
    },
    header_white_title: {
        fontSize: 20,
        fontFamily: 'NunitoSans-Bold',
        color: COLORS.text_dark_51,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    header_innerbody: {
        width: DEVICES.screenWidth * 0.9,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_title: {
        fontFamily: 'NunitoSans-ExtraBold',
        fontSize: 24,
        fontWeight: '500',
        color: COLORS.white,
        marginStart: 20
    },
    content: {
        flex: 1,
        flexDirection: 'column'
    },
    contentBody: {
        paddingHorizontal: DEVICES.screenWidth * 0.05,
        marginTop: 10,
        marginBottom: 50
    },
    footer: {
        height: 60
    },
    footerButton: {
        backgroundColor: COLORS.button_green,
        position: 'absolute',
        top: -30,
        right: DEVICES.screenWidth * 0.05
    },
    footerRight: {
        width: 90,
        height: 45,
        backgroundColor: COLORS.bg_dark,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    cardView: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    button_55: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        elevation: 5,
        shadowOffset: {
            width: -1,
            height: 1,
        },
    },
    button_60: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        elevation: 5,
        shadowOffset: {
            width: -1,
            height: 1,
        },
    },
    errorMessage: {
        marginHorizontal: DEVICES.screenWidth * 0.05,
        fontSize: 16,
        fontFamily: 'NunitoSans-Regular',
        color: COLORS.red
    }
}

export default styles;