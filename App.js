/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { YellowBox } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view'
import Router from './src/Router';

import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from "redux-thunk";
import * as reducers from './src/redux/reducers';

YellowBox.ignoreWarnings(['WebView'])
console.disableYellowBox = true;

const reducer = combineReducers(reducers);

const store = createStore(
  reducer, composeWithDevTools(applyMiddleware(thunk, logger))
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store} >
        <SafeAreaView style={{ flex: 1 }}>
          <Router />
        </SafeAreaView>
      </Provider>
    );
  }
}