const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const config = require("../config/config");

const configuration = new Configuration({
  apiKey: config?.API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateContextText(inputText) {
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
          "content": "You are a topics generator. you are given a chunk of text and you have to generate a list of important 3-5 topics. The response must be generated in a JSON array format only"
        },
        {
          "role": "user",
          "content": "Give me a JSON array list of topics from this text: " + inputText + "\n\n"
        },
      ],
  });

  return completion.data.choices[0].message?.content;
  //console.log(completion.data.choices[0].message);
}

async function generatePratice(context, topic, level, noOFQues) {

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:
      [
        {
          "role": "system",
          "content": "You are a practice question generator. you are given context generated from text and a topic, use them to generate " + noOFQues + " practice questions and their detailed informative answers for given difficulty level based on the topic. You must return the response in JSON Question Answer format"
        },
        {
          "role": "user",
          "content": "Give me a list of question and functional answers from the context below on the topic of " + topic + " at a " + level + " difficulty level in a JSON format:" + context + "\n\n"
        },
      ],
  });

  return completion.data.choices[0].message?.content;
}

async function ContextCreator(inputText) {

  // create a JSON obj to store topics as key and their context as values
  // if a topic is repeacted then context will be merged

  let ContextJSON = {}

  // text processing
  inputText = inputText.replace(/(\r\n|\n|\r)/gm, " ");
  const words = inputText.split(' ');

  // create an array to store chunks of length 3000 words max
  let wordChunks = [];

  for (let i = 0; i < words.length; i + 3000) {

    let chunk = [];

    if (words.length > 3000) {
      chunk = words.splice(0, 3000);
    } else {
      chunk = words.splice(0, words.length);
    }

    wordChunks.push(chunk);
  }

  // now loop thur each chunk in workChunks generating context and topic
  for (let i = 0; i < wordChunks.length; i++) {

    // convert the chunk into text
    let chunk_text = wordChunks[i].join(' ');

    // generate context and topic for the chunk
    let context = await generateContextText(chunk_text);
    let topics = await generateTopicText(chunk_text);

    // loop thru all the topics
    for (let j = 0; i < topics.length; j++) {

      // check if topic already exists in the json
      if (ContextJSON.hasOwnProperty(topics[i])) {
        let newcontext = await generateContextText(ContextJSON[topics[i]] + "\n\n" + context);
        ContextJSON[topics[i]] = newcontext;
      } else {
        ContextJSON[topics[i]] = context;
      }
    }
  }
  return ContextJSON;
}

async function generatePracticeQuestion(id, topic, noOFQues, level) {

  // get contextjSON from mongoDB
  const contextCollection = client.db("stormhacks").collection("context");
  let ContextJSON = await contextCollection.findOne({ _id: id });
  let context = ContextJSON[topic];
  let Ques = generatePratice(context, topic, level, noOFQues)

  return Ques;
}


module.exports = { ContextCreator, generatePracticeQuestion }