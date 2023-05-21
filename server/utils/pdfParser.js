const { Storage } = require("@google-cloud/storage");
const vision = require("@google-cloud/vision").v1;
const fs = require("fs");
const path = require("path");

async function parsePdfToText(fileName, bucketName, outputPrefix) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  const gcsSourceUri = `gs://${bucketName}/${fileName}`;
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

  client
    .asyncBatchAnnotateFiles(request)
    .then((results) => {
      const operation = results[0];
      // Get a Promise representation of the final result of the job
      operation
        .promise()
        .then((filesResponse) => {
          let destinationUri =
            filesResponse[0].responses[0].outputConfig.gcsDestination.uri;
          console.log("Json saved to: " + destinationUri);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
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

// listFiles(bucketName, directoryPath)
//   .then((fileNames) => {
//     if (fileNames) {
//       console.log("Files in the bucket:", fileNames);
//     } else {
//       console.log("Failed to list files in the bucket.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// Usage example

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

    const parsedResponses = [];

    for (const fileName of fileNames) {
      const filePath = path.join(directoryPath, fileName);

      // Call the parseGoogleVisionAPIResponse function for each file
      const extractedText = await parseGoogleVisionAPIResponse(filePath);

      parsedResponses.push({
        fileName: fileName,
        extractedText: extractedText,
      });
    }

    return parsedResponses;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Bucket where the file resides
// const bucketName = process.argv[2];
// Path to PDF file within bucket
// const fileName = process.argv[3];

// parseGoogleVisionAPIResponse(destinationPath)
//   .then((extractedText) => {
//     if (extractedText) {
//       console.log("Extracted text:", extractedText);
//     } else {
//       console.log("Failed to parse the JSON response.");
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

async function parsePDF(directoryPath, bucketName, fileName) {
  // parsePdfToText(fileName, bucketName, directoryPath);
  const filenames = await listFiles(bucketName, directoryPath);

  await downloadJSONFile(bucketName, filenames, directoryPath);
  const result = await parseMultipleGoogleVisionAPIResponses(
    directoryPath
  ).catch((error) => {
    console.log(error);
  });

  console.log(result);
}

// Usage example
// const bucketName = "cloud-samples-data";
const bucketName = "stormhacks-pdf";
const fileName = "pdf/03-474-AppArch.pdf";
const directoryPath = "AppArch";

parsePDF(directoryPath, bucketName, fileName);
