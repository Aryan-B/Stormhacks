const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const Multer = require("multer");
const { uploadPDFToStorage, parsePDF } = require("./utils/pdfParser");
const { ContextCreator, generatePracticeQuestion } = require("./utils/chatUtil");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://demo:admin@cluster0.s7t7n.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


const app = express();
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + fileExtension;
    cb(null, filename);
  }
});

// Set up multer middleware with custom storage
const upload = multer({ storage });

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.SERVE_STATIC) {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Define API endpoints
app.post('/api/upload', upload.single('pdfFile'), async (req, res) => {
  const uploadedFile = req.file;
	//ocr api
	await uploadPDFToStorage(uploadedFile)
	const text = await parsePDF(uploadedFile.originalname, "stormhacks-pdf", uploadedFile.originalname);

  //integrate chatgpt
  const contextJson = await ContextCreator(text);

  console.log(contextJson);
  //Save contextJson to MongoDB
  const contextCollection = client.db("stormhacks").collection("context");
  const result = await contextCollection.insertOne({"text": text});
  console.log(`New listing created with the following id: ${result.insertedId}`);

	res.json({ message: "MongoDB successful complete it" });
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
