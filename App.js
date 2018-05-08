import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Text, Button } from 'react-native';

import MapView from 'react-native-maps'; // 0.21.0

import { Marker } from 'react-native-maps';

import Dashboard from './Dashboard'

import Amplify, { Auth } from 'aws-amplify'
import config from './src/aws-exports'
Amplify.configure(config)

import Tabs from './Tabs'

export default class App extends Component {
    state = {
        isAuthenticated: false,
        mapRegion: null,
        lastLat: null,
        lastLong: null,
        markers: [
            {
                latlng: {latitude:51.499633, longitude: -0.124755},
                title: "you",
                description: "this is one"
            },
            {
                latlng: {latitude:51.503454, longitude:-0.119562},
                title: "me",
                description: "this is one"
            },
            {
                latlng: {latitude:51.5623, longitude:0.2186},
                title: "Hornchurch",
                description: "this is Hornchurch"
            },
            {
                latlng: {latitude:51.5771, longitude:0.1783},
                title: "Romford",
                description: "this is Romford"
            },
        ]
    }

    componentDidMount() {

        this.watchID = navigator.geolocation.watchPosition((position) => {
            // Create the object to update this.state.mapRegion through the onRegionChange function
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }
            this.onRegionChange(region, region.latitude, region.longitude);



            // get what3word api

            var url = `https://api.what3words.com/v2/reverse?coords=${region.latitude}%2C${this.state.lastLong}&key=91HH91N3&lang=en&format=json&display=full`;

            console.log(url);

            return fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {

                    console.log(responseJson)

                })
                .catch((error) =>{
                    console.error(error);
                });
        });

    }

    getTodos() {

        var url = `https://api.what3words.com/v2/reverse?coords=${this.state.lastLat}%2C${this.state.lastLong}&key=91HH91N3&lang=en&format=json&display=full`;

        console.log(url);

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson)

            })
            .catch((error) =>{
                console.error(error);
            });
    }


    onRegionChange(region, lastLat, lastLong) {
        this.setState({
            mapRegion: region,
            // If there are no new values set use the the current ones
            lastLat: lastLat || this.state.lastLat,
            lastLong: lastLong || this.state.lastLong
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);

        console.log(this.state)
    }




    onMapPress(e) {
        console.log(e.nativeEvent.coordinate.longitude);
        let region = {
            latitude:       e.nativeEvent.coordinate.latitude,
            longitude:      e.nativeEvent.coordinate.longitude,
            latitudeDelta:  0.00922*1.5,
            longitudeDelta: 0.00421*1.5
        }
        this.onRegionChange(region, region.latitude, region.longitude);
    }


    authenticate(isAuthenticated) {
        this.setState({ isAuthenticated })
    }

    render() {
        if (this.state.isAuthenticated) {

            console.log('Auth ', Auth)
            return (

                <Dashboard />

            );
        }

        console.log('here');

        return (

            <View style={styles.container}>

                <Tabs screenProps={{authenticate: this.authenticate.bind(this)}} />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

AppRegistry.registerComponent('App', () => App);
