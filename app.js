// ✅ API base URL
 const BASE_API = 'http://localhost:3000';
 let routeGeometry = null; // Global holder

 var map = new ol.Map({
     target: 'map',
     layers: [
         new ol.layer.Tile({
             source: new ol.source.OSM() // OpenStreetMap base layer
         })
     ],
     view: new ol.View({
         //center: ol.proj.fromLonLat([72.862883, 19.126286]), // mumbai coordinates
          center: ol.proj.fromLonLat([79.5308, 17.984]),
         zoom: 17
     })
 });

 // Layer to hold place markers
 const vectorLayer = new ol.layer.Vector({
     source: new ol.source.Vector()
 });
 map.addLayer(vectorLayer);

 // Function to calculate the distance between two coordinates (Haversine formula)
 function calculateDistance(lat1, lon1, lat2, lon2) {
     const R = 6371; // Radius of the Earth in km
     const dLat = (lat2 - lat1) * Math.PI / 180;
     const dLon = (lon2 - lon1) * Math.PI / 180;
     const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
         Math.sin(dLon / 2) * Math.sin(dLon / 2);

     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     return R * c; // Distance in km
 }

 // Updated function to add a marker with distance info
 function addMarkerWithDistance(coordinates, name, distance) {
     const marker = new ol.Feature({
         geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
     });

     marker.setStyle(new ol.style.Style({
         image: new ol.style.Icon({
             anchor: [0.5, 1],
             src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
             scale: 0.09
         }),
         text: new ol.style.Text({
             text: `${name}\n(${distance.toFixed(2)} km)`,
             offsetY: -25,
             fill: new ol.style.Fill({ color: '#000' }),
             backgroundFill: new ol.style.Fill({ color: '#fff' }),
             padding: [2, 2, 2, 2],
             font: '12px sans-serif'
         })
     }));

     return marker;
 }

async function fetchPlacesFromAPI(query, lat, lon) {
    try {
        const response = await fetch('places.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        const filtered = json.results.items.filter(item => item.category.id === query);
        console.log("✅ Filtered places:", filtered);
        return filtered;
    } catch (error) {
        console.error("❌ Error fetching places from API:", error);
        return [];
    }
}




 // Updated function to display places including distance calculation
async function displayPlaces(placeType, lang) {
    const latitude = 17.9835; // Hanumakonda latitude
    const longitude = 79.5308; // Hanumakonda longitude
    const places = await fetchPlacesFromAPI(placeType, latitude, longitude);

    vectorLayer.getSource().clear(); // Clear existing markers

    if (places && places.length > 0) {
        places.forEach(place => {
            const name = lang === 'te' ? place.title : place.title;
            const placeLat = place.position[0]; // Latitude from API response
            const placeLon = place.position[1]; // Longitude from API response
            const distance = calculateDistance(latitude, longitude, placeLat, placeLon);
            const coordinates = [placeLon, placeLat];

            const marker = addMarkerWithDistance(coordinates, name, distance);
            vectorLayer.getSource().addFeature(marker);
        });

        // Adjust the view to fit markers
        const extent = vectorLayer.getSource().getExtent();
        if (extent && !isNaN(extent[0])) { // Check if the extent is valid
            map.getView().fit(extent, { maxZoom: 18, duration: 1000 });
        } else {
            console.warn("Invalid extent. Cannot fit the view.");
        }
    } else {
        console.warn("No places found or invalid data.");
    }
}

 // Text-to-Speech function for English and Telugu
 function speakText(text, lang) {
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';
     window.speechSynthesis.speak(utterance);
 }

 // Start voice recognition with selected language
 function startListening() {
     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
     const lang = document.getElementById('lang-select').value;
     recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
     recognition.interimResults = false;

     recognition.onresult = function (event) {
         const command = event.results[0][0].transcript.toLowerCase();
         document.getElementById('command-output').textContent = `You said: "${command}"`;

         const commandMap = [
             // Eat and Drink
             { keywords: ['restaurant', 'food', 'eat', 'రెస్టారెంట్'], category: 'restaurant', message: 'Showing nearby restaurants.' },
             { keywords: ['coffee', 'tea', 'కాఫీ', 'టీ'], category: 'coffee-tea', message: 'Showing nearby coffee shops.' },

             // Going Out-Entertainment
             { keywords: ['nightlife', 'club', 'క్లబ్'], category: 'nightlife-entertainment', message: 'Showing nearby nightlife spots.' },
             { keywords: ['cinema', 'movie', 'సినిమా'], category: 'cinema', message: 'Showing nearby cinemas.' },
             { keywords: ['theatre', 'music', 'culture', 'మ్యూజిక్', 'సాంస్కృతిక'], category: 'theatre-music-culture', message: 'Showing nearby theatres and music venues.' },
             { keywords: ['gambling', 'lottery', 'betting', 'జూదం'], category: 'gambling-lottery-betting', message: 'Showing nearby gambling spots.' },

             // Sights and Museums
             { keywords: ['landmark', 'attraction', 'చిహ్నం'], category: 'landmark-attraction', message: 'Showing nearby landmarks and attractions.' },
             { keywords: ['museum', 'మ్యూజియం'], category: 'museum', message: 'Showing nearby museums.' },
             { keywords: ['temple', 'religious', 'మందిరం'], category: 'religious-place', message: 'Showing nearby religious places.' },

             // Natural and Geographical
             { keywords: ['lake', 'river', 'water', 'నీటి వనరులు'], category: 'body-of-water', message: 'Showing nearby bodies of water.' },
             { keywords: ['mountain', 'hill', 'పర్వతం'], category: 'mountain-hill', message: 'Showing nearby mountains and hills.' },
             { keywords: ['forest', 'vegetation', 'అడవి'], category: 'forest-vegetation', message: 'Showing nearby forests and vegetation.' },

             // Transport
             { keywords: ['airport', 'ఎయిర్‌పోర్ట్'], category: 'airport', message: 'Showing nearby airports.' },
             { keywords: ['bus', 'public transport', 'బస్'], category: 'public-transport', message: 'Showing nearby public transport stations.' },
             { keywords: ['cargo', 'transportation', 'రవాణా'], category: 'cargo-transportation', message: 'Showing nearby cargo transportation services.' },
             { keywords: ['rest area', 'service area', 'విశ్రాంతి ప్రాంతం'], category: 'rest-area', message: 'Showing nearby rest areas.' },

             // Accommodations
             { keywords: ['hotel', 'motel', 'హోటల్'], category: 'hotel-motel', message: 'Showing nearby hotels and motels.' },
             { keywords: ['lodging', 'stay', 'లాడ్జింగ్'], category: 'lodging', message: 'Showing nearby lodging places.' },

             // Leisure and Outdoor
             { keywords: ['outdoor', 'recreation', 'వినోదం'], category: 'outdoor-recreation', message: 'Showing nearby outdoor recreation spots.' },
             { keywords: ['leisure', 'relax', 'వినోదం'], category: 'leisure', message: 'Showing nearby leisure spots.' },

             // Shopping
             { keywords: ['convenience store', 'grocery', 'దుకాణం'], category: 'convenience-store', message: 'Showing nearby convenience stores.' },
             { keywords: ['mall', 'shopping', 'షాపింగ్'], category: 'mall-shopping-complex', message: 'Showing nearby shopping malls.' },
             { keywords: ['department store', 'డిపార్ట్మెంట్ స్టోర్'], category: 'department-store', message: 'Showing nearby department stores.' },
             { keywords: ['pharmacy', 'medical', 'ఫార్మసీ'], category: 'drugstore-pharmacy', message: 'Showing nearby pharmacies.' },
             { keywords: ['electronics', 'gadgets', 'ఎలక్ట్రానిక్స్'], category: 'electronics', message: 'Showing nearby electronics stores.' },

             // Business and Services
             { keywords: ['bank', 'banking', 'బ్యాంకు'], category: 'banking', message: 'Showing nearby banks.' },
             { keywords: ['atm', 'cash', 'ఎటిఎం'], category: 'atm', message: 'Showing nearby ATMs.' },
             { keywords: ['post office', 'పోస్టాఫీస్'], category: 'post-office', message: 'Showing nearby post offices.' },
             { keywords: ['fuel', 'petrol', 'gas', 'పెట్రోల్'], category: 'fueling-station', message: 'Showing nearby fueling stations.' },
             { keywords: ['car dealer', 'sales', 'కారు డీలర్'], category: 'car-dealer-sales', message: 'Showing nearby car dealers.' },
             { keywords: ['car repair', 'service', 'కారు రిపేర్'], category: 'car-repair-service', message: 'Showing nearby car repair services.' },

             // Facilities
             { keywords: ['hospital', 'health care', 'ఆసుపత్రి'], category: 'hospital-healthcare', message: 'Showing nearby hospitals and healthcare facilities.' },
             { keywords: ['government', 'community center', 'సర్కారు'], category: 'government-community-facility', message: 'Showing nearby government and community facilities.' },
             { keywords: ['education', 'school', 'కళాశాల'], category: 'education-facility', message: 'Showing nearby educational facilities.' },
             { keywords: ['library', 'పుస్తకాలయ'], category: 'library', message: 'Showing nearby libraries.' },

             // Areas and Buildings
             { keywords: ['city', 'town', 'village', 'పట్టణం'], category: 'city-town-village', message: 'Showing nearby cities, towns, or villages.' },
             { keywords: ['building', 'complex', 'కంప్లెక్స్'], category: 'building-complex', message: 'Showing nearby buildings and complexes.' },
             { keywords: ['administrative region', 'region', 'ప్రాంతం'], category: 'administrative-region', message: 'Showing nearby administrative regions.' }
         ];


         const matchedCommand = commandMap.find(item =>
             item.keywords.some(keyword => command.includes(keyword))
         );

         if (matchedCommand) {
             const { category, message } = matchedCommand;
             speakText(message, lang);
             displayPlaces(category, lang);
         } else {
             speakText('Command not recognized. Please try again.', lang);
         }
     };

     recognition.onerror = function (event) {
         console.error('Recognition error:', event.error);
         speakText('Sorry, I could not understand. Please try again.', lang);
     };

     recognition.start();
 }

 // Dynamically load the script
// const script = document.createElement('script');
// script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
// script.type = "application/javascript";
// document.head.appendChild(script);
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
script.type = "application/javascript";
script.onload = () => {
    console.log("✅ jsPDF loaded!");
};
script.onerror = () => {
    alert("❌ Failed to load jsPDF library.");
};
document.head.appendChild(script);

 // Force rendering of the map before capture
 map.renderSync();
async function captureMapAsImage(callback) {
    try {
        map.once('rendercomplete', function () {
            const mapCanvas = document.createElement('canvas');
            const size = map.getSize();
            mapCanvas.width = size[0];
            mapCanvas.height = size[1];
            const mapContext = mapCanvas.getContext('2d');

            Array.prototype.forEach.call(
                map.getViewport().querySelectorAll('.ol-layer canvas'),
                function (canvas) {
                    if (canvas.width > 0) {
                        const opacity = canvas.parentNode.style.opacity;
                        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                        const transform = canvas.style.transform;

                        const match = transform.match(/^matrix\(([^\(]*)\)$/);
                        if (match) {
                            const matrix = match[1].split(',').map(Number);
                            mapContext.setTransform(...matrix);
                            mapContext.drawImage(canvas, 0, 0);
                        } else {
                            console.warn("No transform matrix found, skipping canvas.");
                        }
                    }
                }
            );

            const mapImage = mapCanvas.toDataURL('image/png');
            callback(mapImage);
        });

        map.renderSync(); // Force re-render to trigger capture
    } catch (error) {
        console.error("Error capturing map image:", error);
    }
}
async function fetchAndDownloadPDF() {
    const selectedCategory = document.getElementById('categoryDropdown').value;
    if (!selectedCategory) {
        alert('Please select a category to generate the PDF.');
        return;
    }

    const latitude = 17.9835;
    const longitude = 79.5308;

    try {
        const places = await fetchPlacesFromAPI(selectedCategory, latitude, longitude);
        if (!places.length) {
            alert('No places found for the selected category.');
            return;
        }

        const jsPDF = window.jspdf?.jsPDF;
        if (!jsPDF) {
            alert("❌ jsPDF library not loaded. Please try again after a moment.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Places near Hanumakonda (2km radius) - ${selectedCategory}`, 10, 10);
        doc.setFontSize(12);
        let y = 20;

        for (const place of places) {
            const name = place.title || 'Unknown Name';
            const address = place.vicinity || 'Address not available';
            const dist = calculateDistance(latitude, longitude, place.position[0], place.position[1]);

            doc.text(`Name: ${name}`, 10, y);
            doc.text(`Address: ${address}`, 10, y + 5);
            doc.text(`Distance: ${dist.toFixed(2)} km`, 10, y + 10);
            y += 20;

            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        }

        doc.save(`${selectedCategory}_places.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert('Failed to generate PDF. Please try again later.');
    }
}

//async function fetchAndDownloadPDF() {
//    const selectedCategory = document.getElementById('categoryDropdown').value;
//    if (!selectedCategory) {
//        alert('Please select a category to generate the PDF.');
//        return;
//    }
//
//    const latitude = 17.9835; // Hanumakonda latitude
//    const longitude = 79.5308; // Hanumakonda longitude
//
//    try {
//        const places = await fetchPlacesFromAPI(selectedCategory, latitude, longitude);
//        if (!places.length) {
//            alert('No places found for the selected category.');
//            return;
//        }
//
//       const jsPDF = window.jspdf?.jsPDF;
//       if (!jsPDF) {
//           alert("❌ jsPDF library is not loaded yet. Please try again after a moment.");
//           return;
//       }
//       const doc = new jsPDF();
//        doc.setFontSize(16);
//        doc.text(`Places near Hanumakonda (2km radius) - ${selectedCategory}`, 10, 10);
//        doc.setFontSize(12);
//        let yPosition = 20;
//
//        for (const place of places) {
//            const name = place.title || 'Unknown Name';
//            const address = place.vicinity || 'Address not available';
//            const distance = calculateDistance(latitude, longitude, place.position[0], place.position[1]);
//
//            doc.text(`${name}`, 10, yPosition);
//            doc.text(`   Address: ${address}`, 10, yPosition + 5);
//            doc.text(`   Distance: ${distance.toFixed(2)} km`, 10, yPosition + 10);
//
//            const placeCoordinates = [place.position[1], place.position[0]];
//
//            // Center and mark
//            map.getView().setCenter(ol.proj.fromLonLat(placeCoordinates));
//            map.getView().setZoom(17);
//
//            vectorLayer.getSource().clear();
//            const marker = addMarkerWithDistance(placeCoordinates, name, distance);
//            vectorLayer.getSource().addFeature(marker);
//
//            // ✅ Corrected route draw call
//            const routeGeometry = await fetchRoute([longitude, latitude], placeCoordinates);
//            if (routeGeometry) {
//                drawRoute([longitude, latitude], placeCoordinates); // FIXED
//            }
//
//            await new Promise((resolve) => setTimeout(resolve, 1000));
//
//            // ✅ Fixed image capture
//            await new Promise((resolve) => {
//                captureMapAsImage((mapImage) => {
//                    doc.addImage(mapImage, 'PNG', 10, yPosition + 15, 180, 100);
//                    yPosition += 130;
//                    if (yPosition > 280) {
//                        doc.addPage();
//                        yPosition = 10;
//                    }
//                    resolve();
//                });
//            });
//        }
//
//        doc.save(`${selectedCategory}_places.pdf`);
//    } catch (error) {
//        console.error("Error generating PDF:", error);
//        alert('Failed to generate PDF. Please try again later.');
//    }
//}

async function fetchRoute(startCoords, endCoords) {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(osrmUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.routes && data.routes.length > 0 && data.routes[0].geometry) {
            return data.routes[0].geometry; // Return the route geometry
        } else {
            console.error("No route found or invalid geometry.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching route:", error);
        return null;
    }
}

function drawRoute(routeGeometry) {
if (data.routes && data.routes.length > 0) {
    routeGeometry = data.routes[0].geometry; // ✅ store it globally
}
    // Clear existing route layer (if any)
    if (window.routeLayer) {
        map.removeLayer(window.routeLayer);
    }

    // Create a new route layer
    window.routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.format.GeoJSON().readGeometry(routeGeometry, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                })
            })]
        }),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 4
            })
        })
    });

    // Add the route layer to the map
    map.addLayer(window.routeLayer);
}
 window.onload = function () {
     const targetElement = document.getElementById('yourElementId');
     if (targetElement) {
         targetElement.addEventListener('click', function () {
             console.log('Element clicked!');
         });
     } else {
         console.error('Element with ID "yourElementId" not found.');
     }
 };
 // Add a variable to store the selected place for monitoring
 let selectedPlace = null;

 // Add a variable to store the user's live location marker
 let userLocationMarker = null;
 let currentCoord = null;
 // Function to add a marker for the user's live location
 function addUserLocationMarker(coordinates) {
     if (userLocationMarker) {
         // Update the existing marker
         userLocationMarker.getGeometry().setCoordinates(ol.proj.fromLonLat(coordinates));
     } else {
         // Create a new marker
         userLocationMarker = new ol.Feature({
             geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
         });

         userLocationMarker.setStyle(new ol.style.Style({
             image: new ol.style.Icon({
                 anchor: [0.5, 1],
                 src: 'https://openlayers.org/en/latest/examples/data/dot.png', // Use a different icon for the user
                 scale: 0.5
             })
         }));

         vectorLayer.getSource().addFeature(userLocationMarker);
     }
 }

 // Function to track the user's live location
 function trackUserLocation() {
     if (!navigator.geolocation) {
         console.error("Geolocation is not supported by this browser.");
         return;
     }

     navigator.geolocation.watchPosition(
         (position) => {
             const userLat = position.coords.latitude;
             const userLon = position.coords.longitude;

             // Display the user's live location on the map
             addUserLocationMarker([userLon, userLat]);

             // If a place is selected, calculate the distance and check if the user is within 100m
             if (selectedPlace) {
                 const placeLat = selectedPlace.position[0];
                 const placeLon = selectedPlace.position[1];
                 const distance = calculateDistance(userLat, userLon, placeLat, placeLon);

                 console.log(`Distance to selected place: ${distance.toFixed(2)} km`);

                 if (distance <= 0.1) { // 0.1 km = 100 meters
                     triggerAlert(selectedPlace.title);
                 }
             }
         },
         (error) => {
             console.error("Error getting user location:", error);
         },
         { enableHighAccuracy: true }
     );
 }

    let customAlarmAudio = null;
function triggerAlert(placeName) {
    const alarmSound = new Audio('Alarm.mp3');
    alarmSound.play().catch(err => console.error("❌ Error playing alarm:", err));

    alert(`📍 You are within 100 meters of ${placeName}!`);

    if (navigator.vibrate) {
        navigator.vibrate([500, 500, 500]);
    }
}
 // Update the displayPlaces function to allow selecting a place
async function displayPlaces(placeType, lang) {
   const [longitude, latitude] = currentCoord || [79.5308, 17.984]; // fallback

    const places = await fetchPlacesFromAPI(placeType, latitude, longitude);

    vectorLayer.getSource().clear(); // Clear existing markers

    places.forEach(place => {
        const name = lang === 'te' ? place.title : place.title;
        const placeLat = place.position[0]; // Latitude from API response
        const placeLon = place.position[1]; // Longitude from API response
        const distance = calculateDistance(latitude, longitude, placeLat, placeLon);
        const coordinates = [placeLon, placeLat];

        const marker = addMarkerWithDistance(coordinates, name, distance);
        vectorLayer.getSource().addFeature(marker);

        // Store place data in the marker
        marker.set("placeData", place);
    });

    // Adjust the view to fit markers
    map.getView().fit(vectorLayer.getSource().getExtent(), { maxZoom: 18, duration: 1000 });
}

map.on('click', function (event) {
    const features = map.getFeaturesAtPixel(event.pixel);
    if (features.length > 0) {
        const clickedFeature = features[0];
        const placeData = clickedFeature.get("placeData");

        if (placeData) {
            selectedPlace = placeData;
            selectedPlaceCoord = [placeData.position[1], placeData.position[0]];
            console.log("✅ Selected destination:", selectedPlace.title, selectedPlaceCoord);

            alert(`Monitoring started for ${placeData.title}`);
            document.getElementById('startSimBtn').disabled = false;

           navigator.geolocation.getCurrentPosition(
               (position) => {
                   const liveCoord = [position.coords.longitude, position.coords.latitude];
                   drawRoute(liveCoord, selectedPlaceCoord);
               },
               (error) => {
                   console.warn("⚠️ Geolocation failed, using fallback.");
                   const fallbackCoord = [79.531, 17.984]; // Hanumakonda
                   drawRoute(fallbackCoord, selectedPlaceCoord);
               },
               { enableHighAccuracy: true, timeout: 10000 }
           );


            // Optional: Start live tracking as well
            trackUserLocation();
        }
    }
});

// Ensure the map is interactive for clicks
map.on('pointermove', function (event) {
    const hit = map.hasFeatureAtPixel(event.pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
// Variable to store the interval for updating distance
let distanceUpdateInterval = null;

// Function to update the distance on the webpage
function updateDistanceDisplay(distance) {
    const distanceValueElement = document.getElementById('distance-value');
    if (distanceValueElement) {
        distanceValueElement.textContent = distance.toFixed(2);
    }
}

// Function to fetch and draw the route using OSRM
async function drawRoute(startCoords, endCoords) {
    // Clear the previous route layer (if any)
    if (window.routeLayer) {
        map.removeLayer(window.routeLayer);
    }

    // Create a new route layer
    window.routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 4
            })
        })
    });
    map.addLayer(window.routeLayer);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(osrmUrl);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
            const routeGeometry = data.routes[0].geometry;
            const routeFeature = new ol.format.GeoJSON().readFeature(routeGeometry, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            window.routeLayer.getSource().addFeature(routeFeature);
        } else {
            console.error("No route found.");
        }
    } catch (error) {
        console.error("Error fetching route:", error);
    }

}
    simulateMovementFromRoute(routeGeometry); // <-- Add this line after drawing
// Add a variable to store the live location marker
let liveLocationMarker = null;

// Function to add/update the live location marker
function updateLiveLocationMarker(coordinates) {
    if (!liveLocationMarker) {
        // Create a new marker for the live location
        liveLocationMarker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
        });

        liveLocationMarker.setStyle(new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'https://cdn-icons-png.flaticon.com/512/167/167755.png', // Use a custom icon (e.g., car or person)
                scale: 0.05
            })
        }));

        vectorLayer.getSource().addFeature(liveLocationMarker);
    } else {
        // Update the existing marker's position
        liveLocationMarker.getGeometry().setCoordinates(ol.proj.fromLonLat(coordinates));
    }
}
// Function to track the user's live location
function trackUserLocation() {
    if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
    }

    // Clear the previous interval (if any)
    if (distanceUpdateInterval) {
        clearInterval(distanceUpdateInterval);
    }

    navigator.geolocation.watchPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            // Update the live location marker
            updateLiveLocationMarker([userLon, userLat]);

            // If a place is selected, calculate the distance and update the display
            if (selectedPlace) {
                const placeLat = selectedPlace.position[0];
                const placeLon = selectedPlace.position[1];
                const distance = calculateDistance(userLat, userLon, placeLat, placeLon);

                // Update the distance display
                updateDistanceDisplay(distance);

                // Trigger alert if within 100m
                if (distance <= 0.1) {
                    triggerAlert(selectedPlace.title);
                }
            }
        },
        (error) => {
            console.error("Error getting user location:", error);
        },
        { enableHighAccuracy: true }
    );

    // Update the distance every 10 seconds
    distanceUpdateInterval = setInterval(() => {
        if (selectedPlace) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const placeLat = selectedPlace.position[0];
                const placeLon = selectedPlace.position[1];
                const distance = calculateDistance(userLat, userLon, placeLat, placeLon);
                updateDistanceDisplay(distance);
            });
        }
    }, 10000); // Update every 10 seconds
}
// Function to animate the progress along the route
function animateRouteProgress(routeGeometry) {
    const routeCoordinates = routeGeometry.coordinates;
    let currentIndex = 0;

    const animate = () => {
        if (currentIndex < routeCoordinates.length) {
            const [lon, lat] = routeCoordinates[currentIndex];
            updateLiveLocationMarker([lon, lat]);
            currentIndex++;
            requestAnimationFrame(animate);
        }
    };

    animate();
}

// Update the `drawRoute` function to animate the route
//async function drawRoute(startCoords, endCoords) {
//    // Clear the previous route layer (if any)
//    if (window.routeLayer) {
//        map.removeLayer(window.routeLayer);
//    }
//
//    // Create a new route layer
//    window.routeLayer = new ol.layer.Vector({
//        source: new ol.source.Vector(),
//        style: new ol.style.Style({
//            stroke: new ol.style.Stroke({
//                color: 'blue',
//                width: 4
//            })
//        })
//    });
//    map.addLayer(window.routeLayer);
//
//    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?overview=full&geometries=geojson`;
//
//    try {
//        const response = await fetch(osrmUrl);
//        const data = await response.json();
//
//        if (data.routes && data.routes.length > 0) {
//            const routeGeometry = data.routes[0].geometry;
//            const routeFeature = new ol.format.GeoJSON().readFeature(routeGeometry, {
//                dataProjection: 'EPSG:4326',
//                featureProjection: 'EPSG:3857'
//            });
//            window.routeLayer.getSource().addFeature(routeFeature);
//              // ✅ Start simulation along the route
//                simulateMovementFromRoute(routeGeometry);
//
//            // Animate the progress along the route
//            animateRouteProgress(routeGeometry);
//        } else {
//            console.error("No route found.");
//        }
//    } catch (error) {
//        console.error("Error fetching route:", error);
//    }
//}
let simulationInterval = null;
function getSpeedByMode(mode) {
    switch (mode) {
        case 'walk': return 1.4;  // ~5 km/h
        case 'bike': return 5.5;  // ~20 km/h
        case 'car':  return 13.9; // ~50 km/h
        default: return 1.4;
    }
}

function simulateMovement(startCoord, endCoord) {
    if (simulationInterval) clearInterval(simulationInterval);

    const travelMode = document.getElementById('travelMode').value;
    const speed = getSpeedByMode(travelMode); // meters/second

    let lat1 = startCoord[1];
    let lon1 = startCoord[0];
    const lat2 = endCoord[1];
    const lon2 = endCoord[0];

    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    const steps = distance / (speed * 0.00001); // simulation step count
    const stepLat = (lat2 - lat1) / steps;
    const stepLon = (lon2 - lon1) / steps;

    let stepCount = 0;

    simulationInterval = setInterval(() => {
        lat1 += stepLat;
        lon1 += stepLon;

        const newCoord = [lon1, lat1];
        addUserLocationMarker(newCoord);

        const dx = lon2 - lon1;
        const dy = lat2 - lat1;
        const remaining = Math.sqrt(dx * dx + dy * dy) * 111000;

        const remainingTimeSec = remaining / speed;
        document.getElementById('travelInfo').innerHTML = `
          <b>Distance:</b> ${remaining.toFixed(0)} meters<br>
          <b>ETA:</b> ${Math.floor(remainingTimeSec / 60)}m ${Math.floor(remainingTimeSec % 60)}s
        `;

        if (remaining < 100) {
            triggerAlert("Destination");
            clearInterval(simulationInterval);
        }
    }, 1000);
}

document.getElementById('startSimBtn').addEventListener('click', () => {
    console.log("▶️ Starting Simulation...");
    console.log("selectedPlaceCoord:", selectedPlaceCoord);

    if (!selectedPlaceCoord) {
        alert("Please select a destination first.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const liveCoord = [userLon, userLat];

            console.log("🟢 Using live location for simulation:", liveCoord);

            simulateMovement(liveCoord, selectedPlaceCoord);
            if (routeGeometry) {
                simulateMovementFromRoute(routeGeometry);
            }
        },
        (error) => {
            console.warn("⚠️ Geolocation failed. Using fallback.");
            const fallbackCoord = [79.531, 17.984]; // NITW
            simulateMovement(fallbackCoord, selectedPlaceCoord);
            if (routeGeometry) {
                simulateMovementFromRoute(routeGeometry);
            }
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
});

//function simulateMovementFromRoute(routeGeometry) {
//    const coords = routeGeometry.coordinates;
//    let index = 0;
//
//    const travelMode = document.getElementById('travelMode').value;
//    const speed = getSpeedByMode(travelMode); // m/s
//    const stepDelay = 1000; // 1 second interval
//
//    if (!coords || coords.length === 0) {
//        console.warn("No route coordinates found.");
//        return;
//    }
//
//    simulationInterval = setInterval(() => {
//        if (index < coords.length) {
//            const [lon, lat] = coords[index];
//            addUserLocationMarker([lon, lat]);
//            index++;
//
//            // Optionally calculate remaining distance
//            const [destLon, destLat] = coords[coords.length - 1];
//            const remaining = calculateDistance(lat, lon, destLat, destLon) * 1000;
//            const eta = remaining / speed;
//
//            document.getElementById('travelInfo').innerHTML = `
//              <b>Distance:</b> ${remaining.toFixed(0)} meters<br>
//              <b>ETA:</b> ${Math.floor(eta / 60)}m ${Math.floor(eta % 60)}s
//            `;
//
//            if (remaining < 100) {
//                triggerAlert("Destination");
//                clearInterval(simulationInterval);
//            }
//        } else {
//            clearInterval(simulationInterval);
//        }
//    }, stepDelay);
//}
function simulateMovementFromRoute(routeGeometry) {
    const coords = routeGeometry.coordinates;
    if (!coords || coords.length < 2) {
        console.warn("Not enough points to animate.");
        return;
    }

    const travelMode = document.getElementById('travelMode').value;
    const speed = getSpeedByMode(travelMode); // m/s
    const stepDelay = 1000; // Delay between steps in ms

    let currentIndex = 0;

    function moveToNextPoint() {
        if (currentIndex >= coords.length - 1) {
            triggerAlert("Destination");
            clearInterval(simulationInterval);
            return;
        }

        const [lon, lat] = coords[currentIndex];
        updateLiveLocationMarker([lon, lat]);

        const [nextLon, nextLat] = coords[currentIndex + 1];
        const segmentDistance = calculateDistance(lat, lon, nextLat, nextLon) * 1000;
        const segmentTime = segmentDistance / speed;

        const remaining = calculateDistance(lat, lon, coords[coords.length - 1][1], coords[coords.length - 1][0]) * 1000;
        const eta = remaining / speed;

        document.getElementById('travelInfo').innerHTML = `
            <b>Distance:</b> ${remaining.toFixed(0)} meters<br>
            <b>ETA:</b> ${Math.floor(eta / 60)}m ${Math.floor(eta % 60)}s
        `;

        currentIndex++;
        simulationInterval = setTimeout(moveToNextPoint, segmentTime * 1000); // Wait dynamically based on segment length
    }

    moveToNextPoint(); // Start the loop
}

window.onload = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentCoord = [position.coords.longitude, position.coords.latitude];
      updateLiveLocationMarker(currentCoord); // initial marker
      map.getView().setCenter(ol.proj.fromLonLat(currentCoord));
      map.getView().setZoom(16);
    },
    (error) => {
      console.error("❌ Unable to get live location on load:", error);
    },
    { enableHighAccuracy: true }
  );

  // Attach voice listener
  document.getElementById('startSimBtn').addEventListener('click', () => {
    if (selectedPlace && currentCoord) {
      drawRoute(currentCoord, selectedPlaceCoord);
    }
  });
};


function redirectToInfoPage() {
    // Replace 'info.html' with the path to your other project file or page
    window.location.href = 'info.html';
}

