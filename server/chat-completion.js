const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const config = require("./config/config");

const configuration = new Configuration({
  apiKey: config?.API_KEY,
});
const openai = new OpenAIApi(configuration);

// take a .txt file and separate into 3000 words chunks
/* async function splitTextFile(filePath, maxWordsPerElement) {
  chunkedText = [];

  // read file from inputFile
  let text = fs.readFileSync(filePath, 'utf8');
  text = text.replace(/(\r\n|\n|\r)/gm, " ");

  // split into 3000 words
  const words = text.split(' ');
  let chunk = '';
  for (let i = 0; i < words.length; i++) {
    if (chunk.length < maxWordsPerElement) {
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
} */

async function generateContextText(inputText) {
  // console.log(process.env.OPENAI_API_KEY);
  //console.log(inputText);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:
      [
        {
          "role": "system",
          "content": "You are a context generator. you are given a chunk of text and you have to generate neccessary context from it in less than 1000 words."
        },
        {
          "role": "user",
          "content": "Give me the context from this text: " + inputText + "\n\n"
        },
      ],
  });
  //console.log(completion.data.choices[0].message);

  return completion.data.choices[0].message?.content;
}

async function generateTopicText(inputText) {
  // console.log(process.env.OPENAI_API_KEY);
  //console.log(inputText);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:
      [
        {
          "role": "system",
          "content": "You are a topic and keywords generator. you are given a chunk of text and you have to generate important topics and keywords from it in less than 1000 words."
        },
        {
          "role": "user",
          "content": "Give me a list of topics and keywords from this text: " + inputText + "\n\n"
        },
      ],
  });

  return completion.data.choices[0].message?.content;
  //console.log(completion.data.choices[0].message);
}

async function generatePratice(context, topic, level) {

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:
      [
        {
          "role": "system",
          "content": "You are a practice question generator. you are given context generated from text and a topic, use them to generate 10 practice questions and their detailed informative answers for given difficulty level based on the topic. You must return the response in JSON Question Answer format"
        },
        {
          "role": "user",
          "content": "Give me a list of question and functional answers from the context below on the topic of " + topic + " at a " + level + " difficulty level in a JSON format:" + context + "\n\n"
        },
      ],
  });

  console.log(completion.data.choices[0].message?.content);
}

async function main() {

  const filePath = 'data/extracted_text.txt';
  const maxWordsPerElement = 3000;
  // let array = []

  // Store 4 things 
  // 1. Context - each chunk of text - approx 2000 words
  // 2. Topic - each chunk of text - approx 1000 words
  // 3. Context - all chunks of text - approx 2000 words
  // 4. Topic - all chunks of text - approx 1000 words

  let contextArraySingle = [];
  let topicArraySingle = [];
  let contextArrayAll = '';
  let topicArrayAll = '';

  // the input file text need to be split into chunks of 7000 words and then the remaining text
  // the remaining text will be split into chunks of 3000 words


  // read file from inputFile
  let text = fs.readFileSync(filePath, 'utf8');
  text = text.replace(/(\r\n|\n|\r)/gm, " ");

  // split into 3000 words
  const words = text.split(' ');

  let chunk_1 = [];
  let chunk_remain_words = [];

  // check if the text is more than 3000 words
  if (words.length > 3000) {

    // splice the first 3000 words
    chunk_1 = words.splice(0, 3000);

    // splice the remaining words
    chunk_remain_words = words.splice(0, words.length);

  } else {

    // if the text is less than 7000 words, then the first chunk will be the whole text
    chunk_1 = words.splice(0, words.length);

  }

  // generate context and topic for the first chunk
  let chunk_1_text = chunk_1.join(' ');

  // save the context and topic for the first chunk
  let context_1 = await generateContextText(chunk_1_text);
  let topic_1 = await generateTopicText(chunk_1_text);

  // save them to the array
  contextArraySingle.push(context_1);
  topicArraySingle.push(topic_1);

  // set the context and topic for the first chunk as the context and topic for all chunks
  contextArrayAll = context_1;
  topicArrayAll = topic_1;

  // create an array for the remaining text chunks
  let ChunksArrayRemain = [];

  // split the remaining text into chunks of 3000 words
  for (let i = 0; i < chunk_remain_words.length; i + 3000) {

    let chunk = [];

    if (chunk_remain_words.length > 3000) {
      chunk = chunk_remain_words.splice(0, 3000);
    } else {
      chunk = chunk_remain_words.splice(0, chunk_remain_words.length);
    }

    ChunksArrayRemain.push(chunk);
  }

  // generate context and topic for the remaining chunks
  for (let i = 0; i < ChunksArrayRemain.length; i++) {

    // convert the chunk into text
    let chunk_text = ChunksArrayRemain[i].join(' ');

    // generate context and topic for the chunk
    let context = await generateContextText(chunk_text);
    let topic = await generateTopicText(chunk_text);

    // save them to the array
    contextArraySingle.push(context);
    topicArraySingle.push(topic);

    // merge the chunk text with the context and topic for all chunks
    let context_text = contextArrayAll + "\n" + chunk_text;
    let topic_text = topicArrayAll + "\n" + chunk_text;

    // generate context and topic for the chunk
    context = await generateContextText(context_text);
    topic = await generateTopicText(topic_text);

    // save them to the array
    //contextArraySingle.push(context);
    //topicArraySingle.push(topic);

    // set the context and topic for all chunks as the context and topic for the chunk
    contextArrayAll = context;
    topicArrayAll = topic;

  }

  // generate 10 questions using contextArrayall 
  generatePratice(contextArrayAll, "Object Constructor and Methods", "hard")
}

main();