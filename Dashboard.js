import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
import MapView from 'react-native-maps'; // 0.21.0

import { Marker } from 'react-native-maps';

export default class App extends Component {

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

    render() {


        return (
            <View style={{flex: 1}}>
                <MapView
                    style={styles.map}
                    region={this.state.mapRegion}
                    showsUserLocation={true}
                    followUserLocation={true}
                    onRegionChange={this.onRegionChange.bind(this)}
                    onPress={this.onMapPress.bind(this)}>

                    {this.state.markers.map(marker => (
                        <Marker key={marker.title}
                                coordinate={marker.latlng}
                                title={marker.title}
                                description={marker.description}
                        />
                    ))}
                    <View>
                        <Button title="Location" onPress={this.getTodos.bind(this)}/>

                        <Text style={{color: '#000', textAlign: 'center'}}>
                            { this.state.lastLong } / { this.state.lastLat }

                        </Text>

                        <Text> Im here gof the text </ Text>
                    </View>
                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    }
});

AppRegistry.registerComponent('testCoords', () => testCoords);
