function parsePdfToText(fileName, bucketName) {
  // Imports the Google Cloud client libraries
  const vision = require("@google-cloud/vision").v1;

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // The folder to store the results
  const outputPrefix = "text";

  const gcsSourceUri = `gs://${bucketName}/${fileName}`;
  // const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;
  const gcsDestinationUri = `gs://stormhacks-pdf/${outputPrefix}/`;

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
          console.log(JSON.stringify(filesResponse));

          let destinationUri =
            filesResponse[0].responses[0].outputConfig.gcsDestination.uri;
          console.log("Json saved to: " + destinationUri);

          console.log(filesResponse[0].responses);
        })
        .catch(function (error) {
          console.log(error);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Bucket where the file resides
const bucketName = process.argv[2];
// Path to PDF file within bucket
const fileName = process.argv[3];

parsePdfToText(fileName, bucketName);
