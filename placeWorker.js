// placesWorker.js
self.onmessage = async function () {
    try {
        const response = await fetch('places.json');
        const data = await response.json();
        postMessage(data[0].results.items);
    } catch (error) {
        console.error("Error in Web Worker loading JSON:", error);
        postMessage([]);
    }
};



 const appId = 'TuCAyXuSAu1y0WMtc2IW'; // Replace with your HERE app_id
     const appCode = '0MnSSIVPpAzNnMtCyte0yg'; // Replace with your HERE app_code
///scrap
// // Initialize the map and set view to Hanumakonda region
// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.OSM() // OpenStreetMap base layer
//         })
//     ],
//     view: new ol.View({
//         center: ol.proj.fromLonLat([79.5941, 17.9757]), // Hanumakonda coordinates
//         zoom: 13
//     })
// });

// // Layer to hold place markers
// const vectorLayer = new ol.layer.Vector({
//     source: new ol.source.Vector()
// });
// map.addLayer(vectorLayer);

// // Function to add a marker on the map
// function addMarker(coordinates, name) {
//     const marker = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
//     });

//     marker.setStyle(new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.5, 1],
//             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//             scale: 0.5
//         }),
//         text: new ol.style.Text({
//             text: name,
//             offsetY: -25,
//             fill: new ol.style.Fill({ color: '#000' })
//         })
//     }));

//     return marker;
// }

// // Load places from the JSON file
// async function loadPlaces() {
//     const response = await fetch('places.json'); // Fetch places from local JSON
//     const places = await response.json();
//     return places;
// }

// // Display places on the map based on the specified type
// async function displayPlaces(placeType) {
//     const places = await loadPlaces();
//     vectorLayer.getSource().clear(); // Clear existing markers

//     // Filter places based on type and add them to the map
//     places
//         .filter(place => place.type.toLowerCase() === placeType.toLowerCase())
//         .forEach(place => {
//             const marker = addMarker(place.coordinates, place.name);
//             vectorLayer.getSource().addFeature(marker);
//         });
// }

// // Text-to-Speech (TTS) function to speak out text
// function speakText(text) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'en-US';
//     window.speechSynthesis.speak(utterance);
// }

// // Voice recognition using Web Speech API
// function startListening() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;

//     // Handle the voice command result
//     recognition.onresult = function (event) {
//         const command = event.results[0][0].transcript.toLowerCase();
//         document.getElementById('command-output').textContent = `You said: "${command}"`;

//         // Recognize the command and perform actions
//         if (command.includes('hotel')) {
//             speakText('Showing nearby hotels.');
//             displayPlaces('hotel');
//         } else if (command.includes('petrol')) {
//             speakText('Showing nearby petrol bunks.');
//             displayPlaces('petrol bunk');
//         } else {
//             speakText('Command not recognized. Please say "hotel" or "petrol".');
//         }
//     };

//     // Handle errors during recognition
//     recognition.onerror = function (event) {
//         console.error('Speech recognition error:', event.error);
//         speakText('Sorry, I could not understand. Please try again.');
//     };

//     recognition.start(); // Start listening


// }

// // Attach event listeners to the "Start Listening" button
// document.getElementById('start-button').addEventListener('click', startListening);

////////////////--------------------------------------------------------------------------------------------------------------------
// Initialize the map centered on Hanumakonda
// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.OSM() // OpenStreetMap base layer
//         })
//     ],
//     view: new ol.View({
//         center: ol.proj.fromLonLat([79.5941, 17.9757]), // Hanumakonda coordinates
//         zoom: 13
//     })
// });

// // Layer to hold place markers
// const vectorLayer = new ol.layer.Vector({
//     source: new ol.source.Vector()
// });
// map.addLayer(vectorLayer);

// // Function to add a marker to the map
// function addMarker(coordinates, name) {
//     const marker = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
//     });

//     marker.setStyle(new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.5, 1],
//             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//             scale: 0.5
//         }),
//         text: new ol.style.Text({
//             text: name,
//             offsetY: -25,
//             fill: new ol.style.Fill({ color: '#000' })
//         })
//     }));

//     return marker;
// }

// // Load places from the updated JSON file
// async function loadPlaces() {
//     const response = await fetch('places.json');
//     const data = await response.json();
//     // Check if the JSON is an array of items
//     if (Array.isArray(data)) {
//         console.log("Loaded places data:", data);
//         return data; // Assuming your array is the root of the JSON
//     } else if (data.results && Array.isArray(data.results.items)) {
//         // If your JSON has results.items structure
//         return data.results.items;
//     } else {
//         console.error("Invalid JSON structure:", data);
//         return [];
//     }
// }


// // Display places based on category ID (lat, lon format)
// async function displayPlaces(categoryId, lang) {
//     const places = await loadPlaces();
//     vectorLayer.getSource().clear(); // Clear existing markers

//     places
//         .filter(place => place.category.id === categoryId) // Filter by category ID
//         .forEach(place => {
//             const name = lang === 'te' ? place.title : place.title;
//             const [lat, lon] = place.position; // Read coordinates in [lat, lon] format
//             const marker = addMarker([lon, lat], name); // Pass as [lon, lat]
//             vectorLayer.getSource().addFeature(marker);
//         });
// }

// // Text-to-Speech function for English and Telugu
// function speakText(text, lang) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     window.speechSynthesis.speak(utterance);
// }

// // Start voice recognition with selected language
// function startListening() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     const lang = document.getElementById('lang-select').value;
//     recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     recognition.interimResults = false;

//     recognition.onresult = function (event) {
//         const command = event.results[0][0].transcript.toLowerCase();
//         document.getElementById('command-output').textContent = `You said: "${command}"`;

//         if (command.includes('hotel') || command.includes('హోటల్')) {
//             speakText('Showing nearby hotels.', lang);
//             displayPlaces('restaurant', lang);
//         } else if (command.includes('petrol') || command.includes('పెట్రోల్')) {
//             speakText('Showing nearby petrol bunks.', lang);
//             displayPlaces('petrol-station', lang);
//         } else {
//             speakText('Command not recognized. Please try again.', lang);
//         }
//     };

//     recognition.onerror = function (event) {
//         console.error('Recognition error:', event.error);
//         speakText('Sorry, I could not understand. Please try again.', lang);
//     };

//     recognition.start();
// }

// // Ensure event listener is attached after DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     const startButton = document.getElementById('start-button');
//     if (startButton) {
//         startButton.addEventListener('click', startListening);
//     } else {
//         console.error('Start button not found!');
//     }
// });




// //----------------------------

// // Initialize the map centered on Hanumakonda
// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.OSM() // OpenStreetMap base layer
//         })
//     ],
//     view: new ol.View({
//         center: ol.proj.fromLonLat([79.5941, 17.9757]), // Hanumakonda coordinates
//         zoom: 13
//     })
// });

// // Layer to hold place markers
// const vectorLayer = new ol.layer.Vector({
//     source: new ol.source.Vector()
// });
// map.addLayer(vectorLayer);

// // Function to add a marker to the map
// function addMarker(coordinates, name) {
//     const marker = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
//     });

//     marker.setStyle(new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.5, 1],
//             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//             scale: 0.5
//         }),
//         text: new ol.style.Text({
//             text: name,
//             offsetY: -25,
//             fill: new ol.style.Fill({ color: '#000' })
//         })
//     }));

//     return marker;
// }

// // Load places from JSON
// async function loadPlaces() {
//     const response = await fetch('places.json'); // Fetch from local JSON
//     return await response.json();
// }

// // Display places based on type and selected language
// async function displayPlaces(placeType, lang) {
//     const places = await loadPlaces();
//     vectorLayer.getSource().clear(); // Clear existing markers

//     places
//         .filter(place => place.type.toLowerCase() === placeType.toLowerCase())
//         .forEach(place => {
//             const name = lang === 'te' ? place.name_te : place.name_en;
//             const marker = addMarker(place.coordinates, name);
//             vectorLayer.getSource().addFeature(marker);
//         });
// }

// // Text-to-Speech function for English and Telugu
// function speakText(text, lang) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     window.speechSynthesis.speak(utterance);
// }

// // Start voice recognition with selected language
// function startListening() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     const lang = document.getElementById('lang-select').value;
//     recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     recognition.interimResults = false;

//     recognition.onresult = function (event) {
//         const command = event.results[0][0].transcript.toLowerCase();
//         document.getElementById('command-output').textContent = `You said: "${command}"`;

//         if (command.includes('hotel') || command.includes('హోటల్')) {
//             speakText('Showing nearby hotels.', lang);
//             displayPlaces('hotel', lang);
//         } else if (command.includes('petrol') || command.includes('పెట్రోల్')) {
//             speakText('Showing nearby petrol bunks.', lang);
//             displayPlaces('petrol bunk', lang);
//         } else {
//             speakText('Command not recognized. Please try again.', lang);
//         }
//     };

//     recognition.onerror = function (event) {
//         console.error('Recognition error:', event.error);
//         speakText('Sorry, I could not understand. Please try again.', lang);
//     };

//     recognition.start();
// }

// // const { SpeechClient } = require('@google-cloud/speech');  // STT
// // const { TextToSpeechClient } = require('@google-cloud/text-to-speech');  // TTS

// // const speechClient = new SpeechClient();  // Initialize Google Speech Client
// // const ttsClient = new TextToSpeechClient();  // Initialize TTS Client

// async function googleSpeak(text, lang) {
//     const request = {
//         input: { text: text },
//         voice: { languageCode: lang === 'te' ? 'te-IN' : 'en-US', ssmlGender: 'NEUTRAL' },
//         audioConfig: { audioEncoding: 'MP3' },
//     };

//     const [response] = await ttsClient.synthesizeSpeech(request);
//     const audio = new Audio(URL.createObjectURL(new Blob([response.audioContent])));
//     audio.play();
// }

// async function googleListen(lang) {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     recognition.interimResults = false;

//     recognition.onresult = async (event) => {
//         const command = event.results[0][0].transcript.toLowerCase();
//         document.getElementById('command-output').textContent = `You said: "${command}"`;

//         if (command.includes('hotel') || command.includes('హోటల్')) {
//             await googleSpeak('Showing nearby hotels.', lang);
//             displayPlaces('hotel', lang);
//         } else if (command.includes('petrol') || command.includes('పెట్రోల్')) {
//             await googleSpeak('Showing nearby petrol bunks.', lang);
//             displayPlaces('petrol bunk', lang);
//         } else {
//             await googleSpeak('Command not recognized. Please try again.', lang);
//         }
//     };

//     recognition.onerror = (event) => {
//         console.error('Speech recognition error:', event.error);
//         googleSpeak('Sorry, I could not understand. Please try again.', lang);
//     };

//     recognition.start();
// }

// // // Attach event listener to "Start Voice Command" button
// // document.getElementById('start-button').addEventListener('click', () => {
// //     const lang = document.getElementById('lang-select').value;
// //     googleListen(lang);
// // });




// // // Attach event listener to the "Start Listening" button
// // document.getElementById('start-button').addEventListener('click', startListening);



///////////////////////////////////////////////////////////////////////////////
// document.addEventListener('DOMContentLoaded', function() {
//     // Ensure startListening is defined before it's called
//     let recognition;
//     const commandOutput = document.getElementById('command-output');

//     // Initialize OpenLayers map
//     const map = new ol.Map({
//       target: 'map',
//       layers: [
//         new ol.layer.Tile({
//           source: new ol.source.OSM(),
//         }),
//       ],
//       view: new ol.View({
//         center: ol.proj.fromLonLat([79.5999, 17.9787]), // Coordinates for Hanumakonda
//         zoom: 15,
//       }),
//     });

//     // Fetch places data and handle filtering
//     fetch('your-api-endpoint-or-json-file')  // Change this to actual endpoint or file path
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//         console.log("Loaded JSON Data:", data);

//         // Filter places
//         const filteredPlaces = data.results.filter(place => place.category && place.category.title === 'Hotel');
//         console.log("Filtered places:", filteredPlaces);

//         // Display filtered places
//         displayPlaces(filteredPlaces);
//         addMarkersToMap(filteredPlaces);
//       })
//       .catch(error => {
//         console.error("Error loading data:", error);
//         commandOutput.textContent = 'Error loading places data.';
//       });

//     // Function to display places
//     function displayPlaces(places) {
//       const placesContainer = document.getElementById('placesContainer');
//       placesContainer.innerHTML = '';  // Clear existing content

//       if (places.length === 0) {
//         placesContainer.innerHTML = 'No places available.';
//         return;
//       }

//       places.forEach(place => {
//         const placeElement = document.createElement('div');
//         placeElement.classList.add('place');
//         const titleElement = document.createElement('h3');
//         titleElement.textContent = place.title;
//         placeElement.appendChild(titleElement);

//         const addressElement = document.createElement('p');
//         addressElement.textContent = place.address ? place.address.text : 'Address not available';
//         placeElement.appendChild(addressElement);

//         placesContainer.appendChild(placeElement);
//       });
//     }

//     // Function to add markers to the map
//     function addMarkersToMap(places) {
//       places.forEach(place => {
//         const coordinate = ol.proj.fromLonLat([place.longitude, place.latitude]);
//         const marker = new ol.Feature({
//           geometry: new ol.geom.Point(coordinate),
//           name: place.title,
//         });

//         const vectorSource = new ol.source.Vector({
//           features: [marker],
//         });

//         const markerLayer = new ol.layer.Vector({
//           source: vectorSource,
//         });

//         map.addLayer(markerLayer);
//       });
//     }

//     // Voice command setup
//     if ('webkitSpeechRecognition' in window) {
//       recognition = new webkitSpeechRecognition();
//       recognition.lang = document.getElementById('lang-select').value;
//       recognition.continuous = false;

//       recognition.onstart = function() {
//         commandOutput.textContent = 'Listening for voice command...';
//       };

//       recognition.onresult = function(event) {
//         const command = event.results[0][0].transcript.toLowerCase();
//         commandOutput.textContent = `You said: ${command}`;

//         if (command.includes("hotel")) {
//           displayFilteredMarkers('Hotel');
//         } else if (command.includes("petrol")) {
//           displayFilteredMarkers('Petrol Station');
//         }
//       };

//       recognition.onerror = function(event) {
//         commandOutput.textContent = 'Error occurred in recognition: ' + event.error;
//       };
//     } else {
//       commandOutput.textContent = 'Voice recognition not supported in this browser.';
//     }

//     // Start listening for voice commands
//     function startListening() {
//       if (recognition) {
//         recognition.start();
//       }
//     }

//     // Filter markers based on voice command
//     function displayFilteredMarkers(category) {
//       const filteredPlaces = data.results.filter(place => place.category && place.category.title.toLowerCase() === category.toLowerCase());
//       displayPlaces(filteredPlaces);
//       addMarkersToMap(filteredPlaces);
//     }

//     // Language selection event
//     document.getElementById('lang-select').addEventListener('change', function() {
//       if (recognition) {
//         recognition.lang = this.value;
//       }
//     });

//     // Assign startListening function to the button in HTML
//     window.startListening = startListening;
//   });

///////////////////////////////////////////////////////////////////////////////////////////////////////

// // Initialize the map centered on Hanumakonda
// var map = new ol.Map({
//     target: 'map',
//     layers: [
//         new ol.layer.Tile({
//             source: new ol.source.OSM() // OpenStreetMap base layer
//         })
//     ],
//     view: new ol.View({
//         center: ol.proj.fromLonLat([79.5941, 17.9757]), // Hanumakonda coordinates
//         zoom: 13
//     })
// });

// // Layer to hold place markers
// const vectorLayer = new ol.layer.Vector({
//     source: new ol.source.Vector()
// });
// map.addLayer(vectorLayer);

// // Function to add a marker to the map
// function addMarker(coordinates, name) {
//     const marker = new ol.Feature({
//         geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinates))
//     });

//     marker.setStyle(new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.5, 1],
//             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
//             scale: 0.5
//         }),
//         text: new ol.style.Text({
//             text: name,
//             offsetY: -25,
//             fill: new ol.style.Fill({ color: '#000' })
//         })
//     }));

//     return marker;
// }

// // Load places from JSON
// async function loadPlaces() {
//     try {
//         const response = await fetch('places.json'); // Fetch from local JSON
//         const data = await response.json();

//         // Ensure the structure matches the expected format
//         if (Array.isArray(data) && data[0]?.results?.items) {
//             return data[0].results.items; // Return the items array
//         } else {
//             console.error("Invalid JSON structure:", data);
//             return [];
//         }
//     } catch (error) {
//         console.error("Error loading places:", error);
//         return [];
//     }
// }

// // Display places based on type and selected language
// async function displayPlaces(placeType, lang) {
//     const places = await loadPlaces();
//     vectorLayer.getSource().clear(); // Clear existing markers

//     places
//         .filter(place => {
//             // Check if category and category.id exist
//             return place.category && place.category.id &&
//                    place.category.id.toLowerCase() === placeType.toLowerCase();
//         })
//         .forEach(place => {
//             const name = lang === 'te' ? place.title : place.title; // Use title (add title_te if available in the future)
//             const coordinates = place.position.reverse(); // Use `position` for coordinates (reversed for OpenLayers [lon, lat])
//             const marker = addMarker(coordinates, name);
//             vectorLayer.getSource().addFeature(marker);
//         });
// }

// // async function displayPlaces(placeType, lang) {
// //     const places = await loadPlaces();
// //     vectorLayer.getSource().clear();

// //     const filteredPlaces = places.filter(place => {
// //         return place.category?.id?.toLowerCase() === placeType.toLowerCase();
// //     });

// //     if (filteredPlaces.length === 0) {
// //         console.warn("No places found for the given type:", placeType);
// //         return;
// //     }

// //     filteredPlaces.slice(0, 20000).forEach(place => {
// //         const name = lang === 'te' ? place.title : place.title;
// //         const coordinates = place.position.reverse();
// //         const marker = addMarker(coordinates, name);
// //         vectorLayer.getSource().addFeature(marker);
// //     });

// //     // Adjust the view to fit markers
// //     map.getView().fit(vectorLayer.getSource().getExtent(), { maxZoom: 18, duration: 1000 });
// // }

// // Text-to-Speech function for English and Telugu
// function speakText(text, lang) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     window.speechSynthesis.speak(utterance);
// }

// // Start voice recognition with selected language
// function startListening() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     const lang = document.getElementById('lang-select').value;
//     recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
//     recognition.interimResults = false;

//     recognition.onresult = function (event) {
//         const command = event.results[0][0].transcript.toLowerCase();
//         document.getElementById('command-output').textContent = `You said: "${command}"`;

//         const commandMap = [
//             { keywords: ['restaurant', 'food', 'eat', 'తిండి'], category: 'restaurant', message: 'Showing nearby restaurants.' },
//             { keywords: ['coffee', 'tea', 'కాఫీ', 'టీ'], category: 'coffee-tea', message: 'Showing nearby coffee shops.' },
//             { keywords: ['nightlife', 'club', 'క్లబ్'], category: 'nightlife-entertainment', message: 'Showing nearby nightlife spots.' },
//             { keywords: ['cinema', 'movie', 'సినిమా'], category: 'cinema', message: 'Showing nearby cinemas.' },
//             { keywords: ['museum', 'మ్యూజియం'], category: 'museum', message: 'Showing nearby museums.' },
//             { keywords: ['temple', 'religious', 'మందిరం'], category: 'religious-place', message: 'Showing nearby temples.' },
//             { keywords: ['airport', 'ఎయిర్‌పోర్ట్'], category: 'airport', message: 'Showing nearby airports.' },
//             { keywords: ['bus', 'transport', 'బస్'], category: 'public-transport', message: 'Showing nearby transport stations.' },
//             { keywords: ['hotel', 'హోటల్'], category: 'hotel-motel', message: 'Showing nearby hotels.' },
//             { keywords: ['petrol', 'fuel', 'పెట్రోల్'], category: 'fueling-station', message: 'Showing nearby petrol bunks.' },
//             { keywords: ['pharmacy', 'medical', 'ఫార్మసీ'], category: 'drugstore-pharmacy', message: 'Showing nearby pharmacies.' },
//             { keywords: ['shopping', 'mall', 'షాపింగ్'], category: 'mall-shopping-complex', message: 'Showing nearby shopping centers.' }
//         ];

//         const matchedCommand = commandMap.find(item =>
//             item.keywords.some(keyword => command.includes(keyword))
//         );

//         if (matchedCommand) {
//             const { category, message } = matchedCommand;
//             speakText(message, lang);
//             displayPlaces(category, lang);
//         } else {
//             speakText('Command not recognized. Please try again.', lang);
//         }
//     };

//     recognition.onerror = function (event) {
//         console.error('Recognition error:', event.error);
//         speakText('Sorry, I could not understand. Please try again.', lang);
//     };

//     recognition.start();
// }

// // Attach event listener to the "Start Voice Command" button
// window.onload = () => {
//     document.getElementById('start-button').addEventListener('click', startListening);
// };
 var map = new ol.Map({
     target: 'map',
     layers: [
         new ol.layer.Tile({
             source: new ol.source.OSM() // OpenStreetMap base layer
         })
     ],
     view: new ol.View({
         center: ol.proj.fromLonLat([79.531, 17.984]), // Hanumakonda coordinates
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
             src: 'https://openlayers.org/en/latest/examples/data/icon.png',
             scale: 0.5
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

 // Function to fetch places from the HERE Places API
 async function fetchPlacesFromAPI(query, lat, lon) {
    const appId = 'TuCAyXuSAu1y0WMtc2IW'; // Replace with your HERE app_id
     const appCode = '0MnSSIVPpAzNnMtCyte0yg'; // Replace with your HERE app_code
     const apiUrl = `https://places.api.here.com/places/v1/discover/search?app_id=${appId}&app_code=${appCode}&q=${query}&at=${lat},${lon}&pretty`;

     try {
         const response = await fetch(apiUrl);
         const data = await response.json();

         if (data.results && data.results.items) {
             return data.results.items;
         } else {
             console.error("Invalid API response:", data);
             return [];
         }
     } catch (error) {
         console.error("Error fetching places from API:", error);
         return [];
     }
 }

 // Updated function to display places including distance calculation
 async function displayPlaces(placeType, lang) {
     const latitude = 17.984; // Hanumakonda latitude
     const longitude = 79.531; // Hanumakonda longitude
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
     });

     // Adjust the view to fit markers
     map.getView().fit(vectorLayer.getSource().getExtent(), { maxZoom: 18, duration: 1000 });
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
 // // Include jsPDF script for generating PDF
 // document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"><\/script>');
 // Dynamically load the script
 const script = document.createElement('script');
 script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js";
 script.type = "application/javascript";
 document.head.appendChild(script);

 // Function to fetch data from API and generate PDF
 async function fetchAndDownloadPDF() {
     const selectedCategory = document.getElementById('categoryDropdown').value;
     if (!selectedCategory) {
         alert('Please select a category to generate the PDF.');
         return;
     }

     const latitude = 17.9835; // Hanumakonda latitude
     const longitude = 79.5308; // Hanumakonda longitude

     try {
         // Fetch places from API
         const places = await fetchPlacesFromAPI(selectedCategory, latitude, longitude);
         if (!places.length) {
             alert('No places found for the selected category.');
             return;
         }

         // Create a new PDF
         const { jsPDF } = window.jspdf;
         const doc = new jsPDF();

         // Add title
         doc.setFontSize(16);
         doc.text(`Places near Hanumakonda (2km radius) - ${selectedCategory}`, 10, 10);

         // Add places to PDF
         let yPosition = 20; // Initial vertical position
         doc.setFontSize(12);
         places.forEach((place, index) => {
             const name = place.title || 'Unknown Name';
             const address = place.vicinity || 'Address not available';
             const distance = calculateDistance(latitude, longitude, place.position[0], place.position[1]);

             doc.text(`${index + 1}. ${name}`, 10, yPosition);
             doc.text(`   Address: ${address}`, 10, yPosition + 5);
             doc.text(`   Distance: ${distance.toFixed(2)} km`, 10, yPosition + 10);

             yPosition += 20; // Increment position
             if (yPosition > 280) { // Create a new page if the content exceeds the page height
                 doc.addPage();
                 yPosition = 10;
             }
         });

         // Save the PDF
         doc.save(`${selectedCategory}_places.pdf`);
     } catch (error) {
         console.error("Error generating PDF:", error);
         alert('Failed to generate PDF. Please try again later.');
     }
 }

 // // Attach event listener to the "Start Voice Command" button
 // window.onload = () => {
 //     document.getElementById('start-button').addEventListener('click', startListening);
 // };
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