const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/raw-video.mkv', (req, res) => {
    const mkvPath = path.join(__dirname, 'video.mkv');
    if (!fs.existsSync(mkvPath)) {
        return res.status(404).send('Video file not found');
    }
    res.setHeader('Content-Type', 'video/x-matroska');
    fs.createReadStream(mkvPath).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
