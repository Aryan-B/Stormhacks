const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const Multer = require("multer");
const { uploadPDFToStorage } = require("./utils/pdfParser");
var multiparty = require('multiparty');

const app = express();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, filename);
  }
});

// Set up multer middleware with custom storage
const upload = multer({ storage });



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

// Define API endpoints
app.post('/api/upload', upload.single('pdfFile'), (req, res) => {
	const uploadedFile = req.file;
	//ocr api

	res.json({ message: 'File uploaded successfully' });
});

// app.post('/api/users', (req, res) => {
//   // Logic to create a new user
//   // Send response with newly created user
//   res.json({ user: {...} });
// });

// app.put('/api/users/:id', (req, res) => {
//   const userId = req.params.id;
//   // Logic to update a user with the specified ID
//   // Send response with updated user
//   res.json({ user: {...} });
// });

// app.delete('/api/users/:id', (req, res) => {
//   const userId = req.params.id;
//   // Logic to delete a user with the specified ID
//   // Send response with success message
//   res.json({ message: 'User deleted successfully' });
// });

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



module.exports = app;
