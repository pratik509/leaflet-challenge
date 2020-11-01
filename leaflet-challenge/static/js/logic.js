const API_KEY = "pk.eyJ1IjoicHJhdGlrNTA5IiwiYSI6ImNrZ3liaWViYzA4cGYyc29mbnRzbWdreXMifQ.Bnutv5C-8VS_gj9C2LTzAw";


var link  = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(link, function (data) {

  map_features(data.features);
});

function map_features(data) {

  function onEachfeature(features, layer) {
      layer.bindPopup("<h3>" + features.properties.place + "</h3><hr><p>" + new Date(features.properties.time) + "</p>");
  }

  var pointers = L.geoJSON(data, {
      onEachFeature: onEachfeature,
      pointToLayer: function (features, latitute_longitute) {
          var geoJSONMarker = {
              radius: markerSize(features.properties.mag),
              fillColor: fillColor(features.properties.mag),
              color: "red",
              weight: 0.7,
              opacity: 0.3,
              fillOpacity: 0.5
          };

          return L.circleMarker(latitute_longitute, geoJSONMarker);
      },
  })

  createMap(pointers);
};

function createMap(pointers) {
  
  var streetmap =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "dark-v10",
    accessToken: API_KEY
});


  var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
  };


  var overlayMaps = {
      "Earthquakes": pointers
      
  };

  
  var myMap = L.map("map", {
      center: [34.56, 70.25],
      zoom: 3,
      layers: [streetmap, pointers]
  });

 
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  var legend = L.control({ 
    position: 'bottomright' });

  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'legend'),
          magnitude = [0, 1.0, 2.0, 3.0, 4.0, 5.0],
          labels = [];
     
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML += '<i style= "background:' + fillColor(magnitude[i]) + '"></i> ' +
          magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
      }
      return div;
  };

  legend.addTo(myMap);
}
function fillColor(mag) {
  var color = "";
      if (mag >= 5.0) {
          color ="#ff0000";
      }
      else if (mag >= 4.0) {
          color = "#fc8d59";
      }    
      else if (mag >= 3.0) {
          color= "organge";
      }    
      else if (mag >= 2.0) {
          color= "#d9ef8b";
      }
      else if (mag >= 1.0) {
         color= "#91cf60";
      }   
      else {
        color= "darkgreen"
      }
    return color;
  }
  

function markerSize(mag) {
  return mag * 4
};