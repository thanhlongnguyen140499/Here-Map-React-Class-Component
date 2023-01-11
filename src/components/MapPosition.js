import React, { Component } from "react";

export default class MapPosition extends Component {
  handleOnChange = (ev) => {
    const { onChange } = this.props;
    // pass the values to the parent component
    onChange(ev.target.name, ev.target.value);
  };

  handleSearchInputOnChange = (ev) => {
    const { onSearchInputChange } = this.props;
    // pass the values to the parent component
    onSearchInputChange(ev.target.name, ev.target.value);
  }

  render() {
    const { lat, lng, zoom, searchStr } = this.props;
    return (
      <>
        <div>
          Zoom:
          <input
            onChange={this.handleOnChange}
            name="zoom"
            type="number"
            value={zoom}
          />
        </div>
        <div>
          Latitude:
          <input
            onChange={this.handleOnChange}
            name="lat"
            type="number"
            value={lat}
          />
        </div>
        <div>
          Longitude:
          <input
            onChange={this.handleOnChange}
            name="lng"
            type="number"
            value={lng}
          />
        </div>

        <div>
          SEARCH:
          <input
            onChange={this.handleSearchInputOnChange}
            name="searchStr"
            type="text"
            value={searchStr}
          />
        </div>
      </>
    );
  }
}
