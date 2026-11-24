import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const numQuestions =3;
const difficulty = 'easy';

const imagePath = 'C:/Users/salun/OneDrive/Desktop/ai-quiz-generator/images/meme.png';
const imageData = fs.readFileSync(imagePath).toString('base64');
const prompt = [
    {text: `Attached is an image of note.Generate ${numQuestions} ${difficulty} question based on the imagecontent`},
    {inlineData: {mimeType: 'image/png', data:imageData}}
]

const follow_up_request =["what color is it?"];

async function main(){
const history =[];
history.push({role: 'user', parts: prompt });

     const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents:prompt,
         
        });

        console.log(response.text);

        history.push({role: 'model', parts: [{text: response.text}]});

        const response2 = await ai.models.generateContent({
            model:'gemini-3.1-flash-lite',
            contents: follow_up_request
        });
        console.log(response2.text);
}

main();


