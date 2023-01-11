import logo from "./logo.svg";
import "./App.css";
import Map from "./components/Map";

import React, { Component } from 'react';
import MapPosition from "./components/MapPosition";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 0,
      lat: 0,
      lng: 0,
      searchStr: 'vietnam'
    }
  }

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  handleSearchInputChange = (str, value) => {
    this.setState({
      [str]: value
    })
  }

  handleMapViewChange = (zoom, lat, lng) => {
    this.setState({
      lat,
      lng,
      zoom
    })
  }

  render() {
    const {
      zoom,
      lat,
      lng,
      searchStr
    } = this.state;
    return (
      <div className="App">
        <Map
          lat={lat}
          lng={lng}
          onMapViewChange={this.handleMapViewChange}
          zoom={zoom}
          searchStr={searchStr}
        />
        <MapPosition
          lat={lat}
          lng={lng}
          onChange={this.handleInputChange}
          onSearchInputChange={this.handleSearchInputChange}
          zoom={zoom}
          searchStr={searchStr}
        />
      </div>
    );
  }
}
