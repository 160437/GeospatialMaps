// Initialize the map centered on a default location
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() // OpenStreetMap base layer
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]), // Placeholder center, will update with geolocation
        zoom: 2 // Initial zoom level
    })
});

// Create a vector layer to hold the user's location marker
const userLocationLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
map.addLayer(userLocationLayer);

// Create a feature to represent the user's location
const userLocationFeature = new ol.Feature();

// Style for the user location marker
const userLocationStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 10, // Size of the circle
        fill: new ol.style.Fill({ color: 'blue' }), // Fill color for the circle
        stroke: new ol.style.Stroke({
            color: 'white', // Stroke color for the circle
            width: 2 // Stroke width
        })
    })
});

// Set the style for the user location feature
userLocationFeature.setStyle(userLocationStyle);
userLocationLayer.getSource().addFeature(userLocationFeature);

// Function to update the user's location on the map and live coordinates
function updateUserLocation(position) {
    const coords = [position.coords.longitude, position.coords.latitude]; // [lon, lat]
    userLocationFeature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat(coords))); // Set the user's location

    const view = map.getView();
    view.setCenter(ol.proj.fromLonLat(coords)); // Center the map on the user's location
    view.setZoom(15); // Set zoom level

    // Display live coordinates
    document.getElementById('coordinates').textContent = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
}

// Geolocation setup to track live position updates
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function (position) {
        console.log("Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
        updateUserLocation(position); // Update the user's location dynamically
    }, function (error) {
        console.error("Error getting location: ", error);
    }, {
        enableHighAccuracy: true, // Request high accuracy location
        maximumAge: 0, // Disable caching
        timeout: 8000 // Set a timeout for the geolocation request
    });
} else {
    console.error("Geolocation is not supported by this browser.");
    document.getElementById('coordinates').textContent = "Geolocation not supported by your browser.";
}

// Layer to hold place markers
const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});
map.addLayer(vectorLayer);

// Load places from JSON
async function loadPlaces() {
    const response = await fetch('places.json'); // Fetch from local JSON
    return await response.json();
}

// Function to speak text
function speakText(text, lang) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    const selectedLang = document.getElementById('lang-select').value; // Get selected language
    recognition.lang = selectedLang === 'te' ? 'te-IN' : 'en-US'; // Set language for recognition
    recognition.interimResults = false;
    recognition.continuous = true; // Keep listening continuously

    let command = ''; // Store full command
    let recognitionTimeout;
    let silenceTimeout; // Timeout for detecting silence

    recognition.onresult = function (event) {
        // Reset the silence timeout whenever there is a result
        clearTimeout(silenceTimeout);

        // Concatenate all results as the user continues speaking
        command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        document.getElementById('command-output').textContent = `You said: "${command}"`;

        saveCommand(command); // Store the command for later use

        // Reset the silence timeout to stop listening if there's no speech for 3 seconds
        silenceTimeout = setTimeout(() => {
            console.log('Stopped listening due to silence');
            recognition.stop(); // Stop recognition if no speech for 3 seconds
        }, 3000); // 3,000 milliseconds = 3 seconds

        // Process command if needed
    };

    recognition.onerror = function (event) {
        console.error('Recognition error:', event.error);
    };

    recognition.onend = function () {
        console.log('Speech recognition ended');
        clearTimeout(recognitionTimeout); // Clear the timeout when recognition ends
        clearTimeout(silenceTimeout); // Clear silence timeout when recognition ends

        // Speak "Thank you for giving the information"
        speakText('Thank you for giving the information - Aditya', selectedLang);
    };

    // Start recognition and set a timeout for 20 seconds
    recognition.start();

    // Ensure speech recognition waits for a full 20 seconds
    recognitionTimeout = setTimeout(() => {
        console.log('Stopped listening after 20 seconds');
        recognition.stop(); // Stop recognition manually after 20 seconds
    }, 20000); // 20,000 milliseconds = 20 seconds
}

// Save spoken command to localStorage
function saveCommand(command) {
    localStorage.setItem('lastCommand', command); // Store command in localStorage
    console.log('Command saved:', command); // Log to console for debugging
}

// Function to handle image upload
document.getElementById('image-upload').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the file

        reader.onload = function (e) {
            const imageData = e.target.result; // Get the image data as a base64 string

            // Get the current coordinates (latitude and longitude)
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = [position.coords.longitude, position.coords.latitude]; // [lon, lat]

                // Create a marker with the image at the coordinates
                createImageMarker(coords, imageData);

                // Save the image and coordinates for later use
                saveImageWithCoordinates(imageData, coords);

                console.log('Image uploaded and displayed at coordinates:', coords);
            }, (error) => {
                console.error('Error getting current location:', error);
            });
        };

        reader.readAsDataURL(file); // Read the file as a Data URL
    } else {
        console.error('No file selected.');
    }
});

// Function to create a marker with an image at the specified coordinates
function createImageMarker(coords, imageData) {
    const iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            src: imageData, // Use the uploaded image as the icon
            scale: 0.1, // Scale the image to a smaller size
            anchor: [0.5, 1], // Anchor point of the icon (bottom center)
        }),
    });

    const marker = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(coords)), // Set the marker's coordinates
    });

    marker.setStyle(iconStyle); // Apply the icon style to the marker

    // Add the marker to the vector layer
    vectorLayer.getSource().addFeature(marker);
}

function saveImageWithCoordinates(imageData, coords) {
    let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];

    // Find if this coordinate already exists
    const existingEntry = savedImages.find(entry =>
        entry.coordinates[0] === coords[0] && entry.coordinates[1] === coords[1]
    );

    if (existingEntry) {
        // If coordinate exists, push new image to the array
        existingEntry.images.push(imageData);
    } else {
        // If new coordinate, create an entry
        savedImages.push({
            coordinates: coords,
            images: [imageData]
        });
    }

    // Save updated data back to localStorage
    localStorage.setItem('savedImages', JSON.stringify(savedImages));

    console.log('Saved images:', savedImages);
}


function loadSavedImages() {
    const savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];
    const imageList = document.getElementById('saved-images-list');
    imageList.innerHTML = ""; // Clear previous content

    savedImages.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<p>Coordinates: ${entry.coordinates[1]}, ${entry.coordinates[0]}</p>`;

        entry.images.forEach((image, imgIndex) => {
            // Create image element
            const imgElement = document.createElement('img');
            imgElement.src = image;
            imgElement.style.width = '100px';
            imgElement.style.margin = '5px';

            // Create a delete button for each image
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Remove';
            deleteBtn.onclick = function () {
                removeImage(entry.coordinates, imgIndex);
            };

            // Append image and delete button
            listItem.appendChild(imgElement);
            listItem.appendChild(deleteBtn);
        });

        imageList.appendChild(listItem);
    });

    console.log('Loaded saved images:', savedImages);
}

function removeImage(coords, imgIndex) {
    let savedImages = JSON.parse(localStorage.getItem('savedImages')) || [];

    // Find the entry for the given coordinates
    const entryIndex = savedImages.findIndex(entry =>
        entry.coordinates[0] === coords[0] && entry.coordinates[1] === coords[1]
    );

    if (entryIndex !== -1) {
        // Remove the specific image from the array
        savedImages[entryIndex].images.splice(imgIndex, 1);

        // If no images remain for this coordinate, remove the entire entry
        if (savedImages[entryIndex].images.length === 0) {
            savedImages.splice(entryIndex, 1);
        }

        // Update localStorage
        localStorage.setItem('savedImages', JSON.stringify(savedImages));

        // Refresh display
        loadSavedImages();
        console.log('Removed image from:', coords);
    }
}
////// === 1. Send image + text to CLIP model ===
async function sendToClip(imageFile, voiceText) {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("text", voiceText);

  const response = await fetch("http://127.0.0.1:5000/match", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  return result.similarity;
}
async function handleSubmit() {
  const imageInput = document.getElementById("image-upload");
  const imageFile = imageInput.files[0]; // Last uploaded image
  const voiceText = localStorage.getItem("lastCommand");

  if (!imageFile || !voiceText) {
    alert("❗ Please upload an image and speak a command first.");
    return;
  }

  // Get current geolocation
  navigator.geolocation.getCurrentPosition(async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Send to CLIP
    const similarity = await sendToClip(imageFile, voiceText);

    const newPlace = {
      imageName: imageFile.name,
      voiceInput: voiceText,
      similarityScore: similarity,
      timestamp: new Date().toISOString(),
      latitude,
      longitude
    };

    console.log("📦 Sending to server:", newPlace);

    // POST to Flask to save
    try {
      const response = await fetch("http://127.0.0.1:5000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPlace)
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("✅ Successfully saved with voice + image + location!");
      } else {
        alert("❌ Save failed: " + result.error);
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      alert("⚠️ Could not connect to the Flask server.");
    }
  }, (error) => {
    alert("⚠️ Could not get location: " + error.message);
  });
}



// Call this function when the page loads
window.onload = function () {
    loadSavedImages();
};