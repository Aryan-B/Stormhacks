require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");


// take a .txt file and separate into 3000 words chunks
async function splitTextFile(filePath, maxWordsPerElement) {
    const fs = require('fs');
    chunkedText = [];

    // read file from inputFile
    let text = fs.readFileSync(filePath, 'utf8');
    text = text.replace(/(\r\n|\n|\r)/gm, " ");

    // split into 3000 words
    const words = text.split(' ');
    let chunk = '';
    for (let i = 0; i < words.length; i++) {
        if (chunk.length + words[i].length < maxWordsPerElement) {
            chunk += words[i] + ' ';
        } else {
            chunkedText.push(chunk);
            chunk = '';

            // add the word that was too long for the previous chunk
            chunk += words[i] + ' ';
        }
    }
    // return array of chunks
    return chunkedText;
}

async function generateText(inputText) {
    // console.log(process.env.OPENAI_API_KEY);
    console.log(inputText);
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: 
        [
            {"role": "system", 
            "content" : "You are ChatGPT, a large language model trained by OpenAI. You will be given a text prompt. Your task is to generate a response to the prompt."},
            {"role": "user", 
            "content" : "Give me a prompt."},
            // {"role": "assistant", 
            // "content" : "I am doing well"},
            // {"role": "user", 
            // "content" : "What is the mission of the company OpenAI?"}
        ],
      });
      console.log(completion.data.choices[0].message);
}

const filePath = 'data/extracted_text.txt';
const maxWordsPerElement = 7000;
// let array = []

splitTextFile(filePath, maxWordsPerElement)
  .then(splitArray => {
    generateText(splitArray[0]);
    // array = splitArray;
    // return splitArray;
    // console.log(splitArray[0]);
  })
  .catch(error => {
    console.error(error);
});

// generateText(array[0]);
