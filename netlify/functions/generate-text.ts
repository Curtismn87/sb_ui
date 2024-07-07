import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env['GOOGLE_KEY'];
if (!apiKey) {
  throw new Error("GOOGLE_KEY environment variable is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);

const handler: Handler = async (event, context) => {
  try {
    const { name = 'stranger' } = JSON.parse(event.body || '{}');
    const prompt = `Write a children's story about a child named ${name}.`;    

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

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
