const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: "failed", error: "No file uploaded" });
  }

  const form = new FormData();
  form.append("upload_session", "1");
  form.append("numfiles", "1");
  form.append("gallery", "");
  form.append("code", "");
  form.append("optsize", "0");
  form.append("expire", "0");
  form.append("upload[]", fs.createReadStream(req.file.path));

  try {
    const response = await axios.post("https://postimages.org/json", form, {
      headers: form.getHeaders()
    });

    fs.unlinkSync(req.file.path); // Remove uploaded temp file

    const data = response.data;

    res.json({
      status: "success",
      url: data.url,
      thumb: data.thumb_url,
      author: {
        Name: "MOHAMMAD JUBAYER",
        Facebook: "https://facebook.com/profile.php?id=61573052122735"
      }
    });
  } catch (error) {
    fs.unlinkSync(req.file.path); // Cleanup
    res.status(500).json({ status: "failed", error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
