//JSON data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var geojson; 

// Create our map, giving it the streetmap and earthquakes layers to display on load.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
  });

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap)


// Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(magnitude) {
    return Math.sqrt(parseInt(magnitude)) * 25000;
}

//function to choose color based on the magnitude
function chooseColor(magnitude){
    if(magnitude <= 2.5)return "#00FF00";
    else if(magnitude <= 5.4)return "#7DDB00";
    else if(magnitude <= 6.0)return "#FFBE00";
    else if(magnitude <= 6.9)return "#FF7E00";
    else if(magnitude <= 7.9)return "#FF5000";
    else return "#FF0000";
}

//request to get URL 
d3.json(url).then(function (data) {
    console.log(data.features[0].properties.mag);
    console.log(data.features[0].geometry.coordinates[0]);
    console.log(data.features[0].geometry.coordinates[1]);

    //drawing magnitude circles
    var magMarkers = [];

    for (var i = 0; i < data.features.length; i++) {
        // Set the marker radius for the state by passing the population to the markerSize() function.
        magMarkers.push(
          L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: chooseColor(data.features[i].properties.mag),
            radius: markerSize(data.features[i].properties.mag)
          }).bindPopup("<h1>Magnitude: " + data.features[i].properties.mag + 
          "</h1><hr><h2>Location: "+ data.features[i].properties.place+
          "</h2><hr><h3>Depth: "+data.features[i].geometry.coordinates[2] +"</h3>")
        );
    }

    //magnitude circle layer
    var magLayer = L.layerGroup(magMarkers);

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street
    };
      
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: magLayer
    };
      
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({
        position: "bottomright"
    });

    //legend for magnitude
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        //magnitude intervals
        var labels = ["<2.5","2.5-5.4 ", "5.5-6.0", "6.1-6.9","7.0-7.9",">8"];
        //depth intervals
        var colors = ["#00FF00","#7DDB00","#FFBE00","#FF7E00","#FF5000","#FF0000"];

        for (var i = 0; i < labels.length; i++) {
            div.innerHTML += "<li style='background: " + colors[i] + "'>"+ labels[i];
          }

        return div;
    };

    //add legend to map 
    legend.addTo(myMap);

});



