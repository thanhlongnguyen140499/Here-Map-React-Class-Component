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

      // attach the listener
      map.addEventListener("mapviewchange", this.handleMapViewChange);
      // add the interactive behaviour to the map
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // Create the parameters for the routing request:
      let routingParameters = {
        routingMode: "fast",
        transportMode: "car",
        // The start point of the route:
        origin: "16.8581352,106.8588935",
        // The end point of the route:
        destination: "16.047079,108.206230",
        // Include the route shape in the response
        return: "polyline",
      };

      let router = platform.getRoutingService(null, 8);

      router.calculateRoute(routingParameters, this.onResult, (error) => {
        alert(error.message);
      })
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

  // Define a callback function to process the routing response:
  onResult = (result) => {
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
        // Create a linestring to use as a point source for the route line
        let linestring = H.geo.LineString.fromFlexiblePolyline(
          section.polyline
        );

        // Create a polyline to display the route:
        let routeLine = new H.map.Polyline(linestring, {
          style: { strokeColor: "blue", lineWidth: 3 },
        });

        // Create a marker for the start point:
        let startMarker = new H.map.Marker(section.departure.place.location);

        // Create a marker for the end point:
        let endMarker = new H.map.Marker(section.arrival.place.location);

        // Add the route polyline and the two markers to the map:
        this.map.addObjects([routeLine, startMarker, endMarker]);

        // Set the map's viewport to make the whole route visible:
        this.map
          .getViewModel()
          .setLookAtData({ bounds: routeLine.getBoundingBox() });
      });
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
