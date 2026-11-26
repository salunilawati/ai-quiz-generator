
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import readline from 'readline/promises';

// 1. Initialize Gemini
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// 2. Define quiz details
const topics = 'note';
const difficulty = 'easy';
const numQuestions = 3;
const imagePath = 'C:/Users/salun/OneDrive/Desktop/ai-quiz-generator/images/note.png';
const imageData = fs.readFileSync(imagePath).toString('base64');

// 3. Define response schema
const responseSchema = {
    type: 'object',
    properties: {
        questions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    question: {
                        type: 'string'
                    },
                    options: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    correctAnswer: {
                        type: 'string'
                    },
                    difficultyLevel: {
                        type: 'string',
                        enum: ['Easy', 'Medium', 'Difficult']
                    }
                },
                required: [
                    'question',
                    'options',
                    'correctAnswer',
                    'difficultyLevel'
                ]
            }
        }
    },
    required: ['questions']
};

// 4. Configure Gemini
const configuration = {
    systemInstruction: 'Think of yourself as a teacher who creates quizzes. Base every question only on provided notes. Mention the difficulty level. Remember the conversation and answer follow-up questions based on the notes.',
    temperature: 0.2,
    responseMimeType: 'application/json',
    responseSchema: responseSchema
};

// 5. Create dynamic prompt
const prompt = [
    {
        text: `Attached is an image of notes. Generate ${numQuestions} ${difficulty} questions based on the image content.`
    },
    {
        inlineData: {
            mimeType: 'image/png',
            data: imageData
        }
    }
];

// 6. Make API call
async function main() {

    // Create Gemini chat session
    const chat = ai.chats.create({
        model: 'gemini-3.1-flash-lite',
        config: configuration
    });

    const response = await chat.sendMessage({
        message: prompt
    });

    // 7. Convert JSON response into JavaScript object
    const quiz = JSON.parse(response.text);

    // 8. Display quiz questions
    quiz.questions.forEach((q, index) => {

        console.log(`\nQuestion ${index + 1}: ${q.question}`);

        q.options.forEach((option, i) => {
            console.log(`Option ${String.fromCharCode(65 + i)}: ${option}`);
        });

        console.log(`Correct Answer: ${q.correctAnswer}`);
        console.log(`Difficulty: ${q.difficultyLevel}`);

    });

    // 9. Conversation history and follow-up questions
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\nYou can now ask follow-up questions about your notes.');
    console.log('Type "exit" to end the conversation.');

    while (true) {

        const message = await rl.question('\nYou: ');

        if (message.toLowerCase() === 'exit') {
            break;
        }

        const reply = await chat.sendMessage({
            message: message,
            config: {
                responseMimeType: 'text/plain'
            }
        });

        console.log('\nGemini:', reply.text);
    }

    rl.close();
}

// 10. Execute function
main().catch(console.error);
