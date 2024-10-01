// Set Query URL
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'

let myMap = L.map("map", {
    center: [
    0,-110
    ],
    zoom: 2,
});

//Get data from url
d3.json(queryUrl).then(function (data) {
    createMarkers(data.features)
});

// Create markers on the map for each earthquake

function createMarkers(features) {

    for (let i = 0; i < features.length; i++) {
        let quake = features[i];
        let mag = quake.properties.mag;
        let coords = quake.geometry.coordinates.slice(0,2).reverse();
        let depth = quake.geometry.coordinates[2];
        
        L.circleMarker(coords, {
            radius: (Math.pow(mag,3))/10, // Using exponentials to make the differences in mag more pronounced
            color: getColor(depth)
        })  
        .bindPopup(quake.properties.title)
        .addTo(myMap);
    
    }
}

// Function to read depth and color code them

function getColor(depth) {
    if (depth > 90) {
        return "#581845"; // Dark purple
    } else if (depth > 70) {
        return "#900C3F"; // Dark red
    } else if (depth > 50) {
        return "#C70039"; // Red
    } else if (depth > 30) {
        return "#FF5733"; // Orange
    } else if (depth > 10) {
        return "#FFC300"; // Yellow
    } else {
        return "#DAF7A6"; // Light green
    }
}



// Create Legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 10, 30, 50, 70, 90]; // Depths  for the legend
    div.innerHTML = '<h4>Color Legend</h4>'

    // Create a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '; width: 18px; height: 18px; display: inline-block;"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

// Put Legend on map
legend.addTo(myMap);

// Background Street Layer for Map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
