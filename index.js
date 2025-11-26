const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  const videoId = req.query.v;
  if (!videoId) return res.status(400).json({ error: "Add ?v=VIDEO_ID" });

  try {
    const info = await ytdl.getInfo("https://www.youtube.com/watch?v=" + videoId);
    const audio = ytdl.filterFormats(info.formats, 'audioonly')[0];

    res.json({
      url: audio.url,
      title: info.videoDetails.title,
      artist: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      duration: info.videoDetails.lengthSeconds
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Video unavailable" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('API running on port ' + port));
