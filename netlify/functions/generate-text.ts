import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env['GOOGLE_KEY'];
if (!apiKey) {
  throw new Error("GOOGLE_KEY environment variable is not defined");
} else {
  console.log("API Key is set");
}

const genAI = new GoogleGenerativeAI(apiKey);

const handler: Handler = async (event, context) => {
  try {
    const { name = '', age = '', gender = '', story_type = '', fav_character = '', learning_pref = '', story_length = 5 } = JSON.parse(event.body || '{}');
    let prompt = `Write a children's story about a ${age} year old ${gender} named ${name}. `;
    prompt += `Start the story by saying: This is a story about ${name}, a ${age} year old ${gender} `;
    if (story_type) {
      prompt += `who loves ${story_type} stories `;
    }
    if (fav_character) {
      prompt += `and their favorite character is ${fav_character}. `;
    }
    if (learning_pref) {
      prompt += `The story should teach a lesson about ${learning_pref}. `;
    }
    prompt += `The story should be approximately ${story_length} minutes long.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: text }),
    };
  } catch (error) {
    let errorMessage = 'Failed to generate text';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate text', details: errorMessage }),
    };
  }
};

export { handler };
