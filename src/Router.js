import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import LoginScreen from './components/auth/Login';
import QRLoginScreen from './components/auth/QRLogin';
import AssetsWithCustomerScreen from './components/home/customer/AssetsWithCustomer';
import InvoiceQRScreen from './components/home/customer/InvoiceQR';
import AssetQR1Screen from './components/home/dispatch/AssetQR1';
import AssetQR2Screen from './components/home/dispatch/AssetQR2';
import AssetsWithCustomer_DispatchScreen from './components/home/dispatch/AssetsWithCustomer';
import DispatchScreen from './components/home/dispatch/Dispatch';
import DispatchErrorScreen from './components/home/dispatch/DispatchError';
import InvoiceQR_DispatchScreen from './components/home/dispatch/InvoiceQR';
import SearchCustomerScreen from './components/home/dispatch/SearchCustomer';
import SearchSerial_DispatchScreen from './components/home/dispatch/SearchSerial';
import HomeScreen from './components/home/Home';
import AssetQRScreen from './components/home/return/AssetQR';
import AssetQR3Screen from './components/home/return/AssetQR2';
import ReturnScreen from './components/home/return/Return';
import SearchSerial_ReturnScreen from './components/home/return/SearchSerial';
import SettingScreen from './components/setting/Setting';
import SplashScreen from './components/splash/Splash';

const stack = createStackNavigator(
    {
        Splash: { screen: SplashScreen },
        Login: { screen: LoginScreen },
        QRLogin: { screen: QRLoginScreen },
        Home: { screen: HomeScreen },
        Setting: { screen: SettingScreen },
        InvoiceQR: { screen: InvoiceQRScreen },
        AssetsWithCustomer: { screen: AssetsWithCustomerScreen },
        InvoiceQR_Dispatch: { screen: InvoiceQR_DispatchScreen },
        SearchCustomer: { screen: SearchCustomerScreen },
        AssetsWithCustomer_Dispatch: { screen: AssetsWithCustomer_DispatchScreen },
        AssetQR1_Dispatch: { screen: AssetQR1Screen },
        SearchSerial_Dispatch: { screen: SearchSerial_DispatchScreen },
        DispatchError: { screen: DispatchErrorScreen },
        Dispatch: { screen: DispatchScreen },
        AssetQR2_Dispatch: { screen: AssetQR2Screen },
        AssetQR_Return: { screen: AssetQRScreen },
        AssetQR2_Return: { screen: AssetQR3Screen },
        SearchSerial_Return: { screen: SearchSerial_ReturnScreen },
        Return: { screen: ReturnScreen }
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none'
    }
);

const router = createAppContainer(stack)
export default router