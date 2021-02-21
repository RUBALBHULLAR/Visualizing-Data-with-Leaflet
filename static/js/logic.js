// get data
const allWeekURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// radius multiplier
var radiusX = 4;

// grab data with d3
d3.json(allWeekURL, function (data) {
  console.log(data.features);
  console.log(data);

  function getColor(d) {
    return d > 90 ? '#b31b1b' : 
           d > 70  ? '#ff4040' : 
           d > 50  ? '#ed9121' : 
           d > 30   ? '#f8de7e' :
           d > 10   ? '#ccff00' :
                      '#00ff00';
  }
    // switch (true) {
    //   case (d > 90) : return '#b31b1b'; break;  // carnelian
    //   case (d > 70 && d <= 90) : return '#ff8243'; break; // mango tango
    //   case (d > 50 && d <= 70) : return '#e25822'; break;  // flame
    //   case (d > 30 && d <= 50) : return '#f8de7e'; break; // jasmine
    //   case (d > 10 && d <= 30) : return '#ccff00'; break;  // flourescent yellow
    //   case (d > -10 && d <= 10) : return '#00ff00'; break; //  green
    //   default: return '#087830';  // la salle green
    // }
  

  // create features
  // create a geoJSON layer containing the features array on the earthquakes object
  var earthquakes = L.geoJSON(data.features, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * radiusX,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<br>
      Depth: ${feature.geometry.coordinates[2]} <br>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
  }).addTo(myMap);

  // set legend at bottom right of screen
var legend = L.control({
  position: 'bottomright'
});

// add legend
legend.onAdd = function (color) {
  var div = L.DomUtil.create('div', 'info legend');
  var levels = ['-10-10','10-30','30-50','50-70','70-90','90+'];
  var colors = ['#00ff00','#ccff00','#f8de7e','#ed9121','#ff4040','#b31b1b'];
  for (var i=0; i < levels.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
  }
  return div;
}
legend.addTo(myMap);


}); // end d3.json

// create map layers
// greyscale
var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// satellite
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// outdoors
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// define baseMaps object to hold base layers
var baseMaps = {
  "Satellite ": satellite,
  "Grayscale ": greyscale,
  "Outdoors ": outdoors
};


// Creating map object, attach streetmap, 
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5,
  layers: [greyscale]
});

// create a layer control
// pass baseMaps and overlayMaps
// add the layer control to the map
L.control.layers(baseMaps, {
  collapsed: false
}).addTo(myMap);