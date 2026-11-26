import {ai,model,systemInstruction} from './assistant.js';

async function main(){
    const response = await ai.models.generateContent({
        model: model,
        contents:'how can a farmers son chase a carrer? ',
        config:{

            systemInstruction: systemInstruction,

            responseMimeType: 'application/json',

            responseSchema: {
                type:'OBJECT',
                properties: {
                    questions: {
                        type: 'STRING',
                    },
                    answer:{
                        type: 'STRING',
                    }
            },
            required: ['questions','answer']
        }
    }

});

const result =JSON.parse(response.text);

console.log('\nQuestion:',result.questions);
console.log('\nAnswer:',result.answer);
}

main();