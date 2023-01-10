import React from "react";
import H from "@here/maps-api-for-javascript";
import onResize from "simple-element-resize-detector";

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    // the reference to the container
    this.ref = React.createRef();
    // reference to the map
    this.map = null;
  }

  componentDidMount() {
    const circle = new H.map.Circle({ lat: 16, lng: 108 }, 80000);

    if (!this.map) {
      // instantiate a platform, default layers and a map as usual
      const platform = new H.service.Platform({
        apikey: "RpBrr7I5gAEGBZaUpbMRVW8STCXVc5UgTKQgNvRSpSU",
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(this.ref.current, layers.vector.normal.map, {
        pixelRatio: window.devicePixelRatio,
        center: { lat: 16, lng: 108 },
        zoom: 4,
      });
      onResize(this.ref.current, () => {
        map.getViewPort().resize();
      });
      this.map = map;

      // Add the circle to the map:
      map.addObject(circle);

      // attach the listener
      map.addEventListener("mapviewchange", this.handleMapViewChange);
      // add the interactive behaviour to the map
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    }
  }

  componentDidUpdate() {
    const { lat, lng, zoom } = this.props;

    if (this.map) {
      // prevent the unnecessary map updates by debouncing the
      // setZoom and setCenter calls
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.map.setZoom(zoom);
        this.map.setCenter({ lat, lng });
      }, 100);
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener("mapviewchange", this.handleMapViewChange);
    }
  }

  handleMapViewChange = (ev) => {
    const { onMapViewChange } = this.props;
    if (ev.newValue && ev.newValue.lookAt) {
      const lookAt = ev.newValue.lookAt;
      // adjust precision
      const lat = Math.trunc(lookAt.position.lat * 1e7) / 1e7;
      const lng = Math.trunc(lookAt.position.lng * 1e7) / 1e7;
      const zoom = Math.trunc(lookAt.zoom * 1e2) / 1e2;
      onMapViewChange(zoom, lat, lng);
    }
  };

  render() {
    return (
      <div
        style={{ position: "relative", width: "100%", height: "500px" }}
        ref={this.ref}
      />
    );
  }
}
