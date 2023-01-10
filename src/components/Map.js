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
    const customStyle = {
      strokeColor: "black",
      fillColor: "rgba(255, 255, 255, 0.5)",
      lineWidth: 4,
      lineCap: "square",
      lineJoin: "bevel",
    };
    // Define points to represent the vertices of a short route in Berlin, Germany:
    var points = [
      { lat: 16.5309825, lng: 108.3845921 },
      { lat: 16.5311923, lng: 108.3853495 },
      { lat: 16.53108532, lng: 108.3861756 },
      { lat: 16.5315142, lng: 108.3872163 },
      { lat: 16.5316215, lng: 108.3885574 },
      { lat: 16.5320399, lng: 108.3925807 },
      { lat: 16.5321472, lng: 108.3935785 },
      { lat: 16.5323832, lng: 108.395499 },
      { lat: 16.5324261, lng: 108.3959818 },
      { lat: 16.5325012, lng: 108.397795 },
      { lat: 16.5325656, lng: 108.3986318 },
      { lat: 16.5326192, lng: 108.3989215 },
      { lat: 16.5325119, lng: 108.3989751 },
      { lat: 16.5323081, lng: 108.3991039 },
      { lat: 16.5318789, lng: 108.3994472 },
      { lat: 16.5301194, lng: 108.4009278 },
      { lat: 16.5297546, lng: 108.4012604 },
      { lat: 16.5296152, lng: 108.4014106 },
      { lat: 16.5289822, lng: 108.4018934 },
      { lat: 16.5276947, lng: 108.4029663 },
      { lat: 16.5271797, lng: 108.4033203 },
      { lat: 16.5269973, lng: 108.4033954 },
      { lat: 16.5265145, lng: 108.4035349 },
      { lat: 16.5260746, lng: 108.4036851 },
      { lat: 16.5260103, lng: 108.4038353 },
      { lat: 16.5256562, lng: 108.40464 },
      { lat: 16.5253022, lng: 108.4053588 },
      { lat: 16.5250447, lng: 108.4059381 },
      { lat: 16.5249588, lng: 108.4062278 },
      { lat: 16.5249267, lng: 108.4064317 },
      { lat: 16.5249052, lng: 108.406775 },
      { lat: 16.5248623, lng: 108.4069574 },
      { lat: 16.5241864, lng: 108.4089208 },
      { lat: 16.52410827, lng: 108.4091246 },
      { lat: 16.5240898, lng: 108.409307 },
      { lat: 16.524004, lng: 108.4096611 },
      { lat: 16.5239503, lng: 108.4101653 },
      { lat: 16.5239289, lng: 108.4110343 },
      { lat: 16.5238967, lng: 108.4117103 },
      { lat: 16.5238752, lng: 108.4120321 },
      { lat: 16.5236285, lng: 108.4126866 },
      { lat: 16.5231242, lng: 108.41089311 },
      { lat: 16.5227809, lng: 108.4146714 },
      { lat: 16.5224799, lng: 108.4152412 },
    ];

    // Initialize a linestring and add all the points to it:
    var linestring = new H.geo.LineString();
    points.forEach(function (point) {
      linestring.pushPoint(point);
    });
    // Initialize a polyline with the linestring:
    var polyline = new H.map.Polyline(linestring, { style: { lineWidth: 10 } });

    // Create a rectangle and pass the custom style as an options parameter:
    var rect = new H.map.Rect(new H.geo.Rect(15.5, 100.5, 17, 108), {
      style: customStyle,
    });

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
      map.addObject(rect);
      map.addObject(polyline);

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
