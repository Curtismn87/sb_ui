import { Handler, HandlerEvent, HandlerContext, HandlerResponse } from '@netlify/functions';
import * as https from 'https';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
  const apiKey = process.env['GOOGLE_KEY'];
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GOOGLE_KEY environment variable is not defined" }),
    };
  }

  const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  const requestBody = JSON.parse(event.body || '{}');
  const text = requestBody.text || "Hello, world!";

  const payload = {
    "audioConfig": {
      "audioEncoding": "MP3",
      "effectsProfileId": [
        "small-bluetooth-speaker-class-device"
      ],
      "pitch": 0,
      "speakingRate": 1
    },
    "input": {
      "text": text
    },
    "voice": {
      "languageCode": "en-US",
      "name": "en-US-Standard-H"
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          const responseData = JSON.parse(data);
          // The audio content is already base64 encoded in the response
          resolve({
            statusCode: 200,
            body: JSON.stringify({ audioContent: responseData.audioContent }),
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          resolve({
            statusCode: res.statusCode || 500,
            body: JSON.stringify({ error: 'Failed to generate speech', details: data }),
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to generate speech', details: error.message }),
      });
    });

    req.write(JSON.stringify(payload));
    req.end();
  });
};

export { handler };
