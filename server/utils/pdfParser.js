const { Storage } = require("@google-cloud/storage");
const vision = require("@google-cloud/vision").v1;
const fs = require("fs");
const path = require("path");

async function parsePdfToText(fileName, bucketName, outputPrefix) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  const gcsSourceUri = `gs://${bucketName}/pdf/${fileName}`;
  const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;

  const inputConfig = {
    // Supported mime_types are: 'application/pdf' and 'image/tiff'
    mimeType: "application/pdf",
    gcsSource: {
      uri: gcsSourceUri,
    },
  };
  const outputConfig = {
    gcsDestination: {
      uri: gcsDestinationUri,
    },
  };
  const features = [{ type: "DOCUMENT_TEXT_DETECTION" }];
  const request = {
    requests: [
      {
        inputConfig: inputConfig,
        features: features,
        outputConfig: outputConfig,
      },
    ],
  };

  const [operation] = await client.asyncBatchAnnotateFiles(request);
  const [filesResponse] = await operation.promise();
  const destinationUri =
    filesResponse.responses[0].outputConfig.gcsDestination.uri;
  console.log("Json saved to: " + destinationUri);
}

async function listFiles(bucketName, directoryPath) {
  const storage = new Storage();

  try {
    // Retrieve the bucket
    const bucket = storage.bucket(bucketName);

    // List all files in the bucket
    const [files] = await bucket.getFiles({
      prefix: directoryPath,
    });

    // Extract the filenames
    // const fileNames = files.map((file) => file.name);
    const fileNames = files.map((file) => file.name.split("/").pop());

    // Return the list of filenames
    return fileNames;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function downloadJSONFile(bucketName, fileNames, destinationDir) {
  const storage = new Storage();

  try {
    const bucket = storage.bucket(bucketName);

    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Download each file
    await Promise.all(
      fileNames.map(async (fileName) => {
        const file = bucket.file(`${destinationDir}/${fileName}`);
        const destinationPath = `${destinationDir}/${fileName}`;

        // Download the file to the destination folder
        await file.download({ destination: destinationPath });

        console.log(`File downloaded: ${fileName}`);
      })
    );

    console.log(`JSON file downloaded to ${destinationDir}`);
  } catch (error) {
    console.error("Error:", error);
  }
}

// downloadJSONFile(bucketName, fileNames, destinationPath);

async function parseGoogleVisionAPIResponse(jsonFilePath) {
  try {
    // Read the JSON response file
    const responseJson = fs.readFileSync(jsonFilePath, "utf8");

    // Parse the JSON response
    const response = JSON.parse(responseJson);

    // Extract the text from the response
    const pages = response.responses[0].fullTextAnnotation.pages;
    let extractedText = "";

    for (const page of pages) {
      for (const block of page.blocks) {
        for (const paragraph of block.paragraphs) {
          for (const word of paragraph.words) {
            let wordText = "";
            for (const symbol of word.symbols) {
              wordText += symbol.text;
            }
            extractedText += wordText + " ";
          }
        }
      }
    }

    // Return the extracted text
    return extractedText;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function parseMultipleGoogleVisionAPIResponses(directoryPath) {
  try {
    const fileNames = fs.readdirSync(directoryPath);

    let parsedResponses = "";

    for (const fileName of fileNames) {
      const filePath = path.join(directoryPath, fileName);

      // Call the parseGoogleVisionAPIResponse function for each file
      const extractedText = await parseGoogleVisionAPIResponse(filePath);

      parsedResponses += extractedText;
    }

    return parsedResponses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function parsePDF(directoryPath, bucketName, fileName) {
  parsePdfToText(fileName, bucketName, directoryPath);

  const filenames = await listFiles(bucketName, directoryPath);
  await downloadJSONFile(bucketName, filenames, directoryPath);
  const result = await parseMultipleGoogleVisionAPIResponses(
    directoryPath
  ).catch((error) => {
    console.log(error);
  });

  console.log(result);
}

async function uploadPDFToStorage(file) {
  const storage = new Storage();
  const bucket = storage.bucket('stormhacks-pdf');

  try {
    // Sending the upload request
    await bucket.file(`pdf/${file.originalname}`).save(file.buffer);

    console.log(
      `PDF file '${file.originalname}' uploaded successfully to pdf in bucket stormhacks-pdf'.`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

parsePDF("output", "stormhacks-pdf", "test.pdf");
module.exports = {uploadPDFToStorage, parsePDF};