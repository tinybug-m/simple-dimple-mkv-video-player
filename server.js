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
    const mkvPath = path.join(__dirname, 'test.mkv');
    if (!fs.existsSync(mkvPath)) {
        return res.status(404).send('Video file not found');
    }

    const stat = fs.statSync(mkvPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/x-matroska'
        });

        fs.createReadStream(mkvPath, { start, end }).pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/x-matroska',
            'Accept-Ranges': 'bytes'
        });
        fs.createReadStream(mkvPath).pipe(res);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
