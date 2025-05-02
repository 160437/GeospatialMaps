const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, 'places.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serves index.html, app.js, etc.

//// API to get all places
//app.get('/api/places', (req, res) => {
//    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
//        if (err) return res.status(500).send({ error: "Failed to read places.json" });
//        res.json(JSON.parse(data));
//    });
//});
app.get('/api/places', (req, res) => {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);
    const query = req.query.q?.toLowerCase();

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).send({ error: "Latitude and Longitude are required in query params." });
    }

    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).send({ error: "Failed to read places.json" });

        const allData = JSON.parse(data);
        const allItems = allData.flatMap(entry => entry.results.items);

        // Filter by distance (15 km radius)
        let filteredItems = allItems.filter(place => {
            const [lat, lon] = place.position;
            const distance = haversine(userLat, userLon, lat, lon);
            return distance <= 5;
        });

        // ✅ Optional: Further filter by title or category if `q` is present
       if (query) {
           filteredItems = filteredItems.filter(place => {
               const title = place.title?.toLowerCase() || '';
               const vicinity = place.vicinity?.toLowerCase() || '';
               const categoryTitle = place.category?.title?.toLowerCase() || '';
               const categoryId = place.category?.id?.toLowerCase() || '';

               return (
                   title.includes(query) ||
                   categoryTitle.includes(query) ||
                   categoryId.includes(query) ||
                   vicinity.includes(query)
               );
           });
       }


        res.json(filteredItems);
    });
});

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


// API to add new place
app.post('/api/places', (req, res) => {
    const newPlace = req.body;

    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).send({ error: "Error reading places.json" });

        const places = JSON.parse(data);
        places.results.items.push(newPlace);

        fs.writeFile(DATA_PATH, JSON.stringify(places, null, 2), (err) => {
            if (err) return res.status(500).send({ error: "Error writing to places.json" });
            res.json({ message: "Place added successfully" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at: http://localhost:${PORT}`);
});
