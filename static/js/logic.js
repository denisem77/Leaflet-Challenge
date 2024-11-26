// Get your dataset. To do so, follow these steps:

// The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the USGS GeoJSON FeedLinks to an 
// external site. page and choose a dataset to visualize. The following image is an example screenshot of what appears when you visit 
// this link:

// Create a map
const myMap = L.map("map", {
    center: [37.7749, -122.4194], // San Francisco coordinates
    zoom: 4
    });
    
    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
    
    // URL to the USGS GeoJSON API
    const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    
    // Fetch the earthquake data from the USGS GeoJSON API
    d3.json(url).then(function (data) {
        // Loop through the features in the GeoJSON data
        data.features.forEach(function (feature) {
          // Extract coordinates, magnitude, and depth from each earthquake feature
          let coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
          let magnitude = feature.properties.mag;
          let depth = feature.geometry.coordinates[2];
    
          // Create a circle marker with size and color based on magnitude and depth
        L.circle(coordinates, {
            radius: magnitude * 10000,
            color: getColor(depth),
            fillColor: getColor(depth),
            fillOpacity: 0.8
          }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`).addTo(myMap);
        });
    
        // Create a legend
      let legend = L.control({ position: 'bottomright' });
      legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
    
        // Add a white background to the div
        div.style.backgroundColor = 'white';
        div.style.padding = '10px';
    
        // Assign colors to the legend
        div.innerHTML += '<div style="background:' + getColor(0) + ';height:10px;width:10px; display: inline-block;"></div> 0-10<br>';
        div.innerHTML += '<div style="background:' + getColor(10) + ';height:10px;width:10px; display: inline-block;"></div> 10-30<br>';
        div.innerHTML += '<div style="background:' + getColor(30) + ';height:10px;width:10px; display: inline-block;"></div> 30-50<br>';
        div.innerHTML += '<div style="background:' + getColor(50) + ';height:10px;width:10px; display: inline-block;"></div> 50-70<br>';
        div.innerHTML += '<div style="background:' + getColor(70) + ';height:10px;width:10px; display: inline-block;"></div> 70-90<br>';
        div.innerHTML += '<div style="background:' + getColor(90) + ';height:10px;width:10px; display: inline-block;"></div> 90+<br>';
    
        return div;
      };
      legend.addTo(myMap);
    });
    
    // Function to determine color based on depth
    function getColor(depth) {
        if (depth < 10) {
          return "#00ff00"; // Green
        } else if (depth < 30) {
          return "#ffff00"; // Yellow
        } else if (depth < 50) {
          return "#ff9900"; // Orange
        } else if (depth < 70) {
          return "#ff0000"; // Red
        } else {
          return "#990000"; // Dark Red
        }
      }
    