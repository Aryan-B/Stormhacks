const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const Multer = require("multer");
const { uploadPDFToStorage } = require("./utils/pdfParser");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/api', [apiRouter]);

const multer = Multer({
  storage: Multer.memoryStorage()
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  // },
});

if (process.env.SERVE_STATIC) {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

app.post("/pdf", multer.single("file"), async function (req, res, next) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  await uploadPDFToStorage(req.file);
	console.log(req.file);
});

app.listen(3000, () => {
  console.log(`listening at http://localhost:3000`);
});

module.exports = app;
