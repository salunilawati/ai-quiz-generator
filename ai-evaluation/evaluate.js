import {ai,model,systemInstruction} from './assistant.js';

const testCases =[
    {question: 'what is mitochondria?',
        expected:'cell'
    },
    {
        question:'what is 600+600/3!',
        expected:'700'
    },
    {
        question:'current home minister of nepal?',
        expected:'Sudan Gurung'
    }
    
];

async function evaluateAssistant(question){
    const response = await ai.models.generateContent({
        model:model,
        contents: question,
        config:{
            systemInstruction:systemInstruction,
        },
    });
    return response.text;

}

async function runTests() {
    let passed =0;

    for(const test of testCases){
        const response = await evaluateAssistant(test.question);
        const ok =response.toLowerCase().includes(test.expected.toLowerCase());

        console.log('\nQuestion:',test.question);
        console.log('Response:',response);
        console.log('Result:', ok ? 'PASS': 'FAIL');
        
        if (ok) passed++;

    }

    console.log('\n-----------------');
    console.log(`Passed: ${passes}/${testCases.length}`);
    console.log(`Passed rate: ${(passed/ testCases.length)*100}%`);
    
}
runTests();