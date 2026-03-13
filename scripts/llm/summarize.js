
async function getSummary(textToSummarize) {
    const API_URL = 'http://localhost:3000/llm/summarize';

    // since it is protected by oauth, we need a access token first.
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNmRiMTMyNi1hZGIyLTRkZWItYTExMi00OWRkMjMyZTRkYTUiLCJyb2xlIjoicGFyZW50IiwianRpIjoiOGRhNjZhYTUtNzVjNy00MGRjLWI1MTQtNTkzOTFiNzgzNmYzIiwiaWF0IjoxNzczMzc5MTk3LCJleHAiOjE3NzMzODI3OTd9.VGa-2zns_c-lDifm3OKPeJJOaqcMr2rBj4ga-GLiMX0'

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                text: textToSummarize
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`Error (${response.status}):`, data.error);
            return;
        }

        console.log('--- Summary Received ---');
        console.log('Model Used:', data.model);
        console.log('Summary:', data.summary);

    } catch (error) {
        console.error('Network Error:', error.message);
    }
}

// taken from wikipedia
const sampleText = `
A mindset (also known as mentality especially when considered as biased and closed-minded) refers to an established set of attitudes of a person or group concerning culture, values, philosophy, frame of reference, outlook, or disposition.
Person A is said to have a theory of mind (ToM) about person B, relating mindset research to ToM. 
This may also develop from a person's worldview or beliefs about the meaning of life.
A mindset could create an incentive to adopt (or accept) previous behaviors, choices, or tools, sometimes known as cognitive inertia or groupthink. 
When a prevailing mindset is limiting or inappropriate, it may be difficult to counteract its grip on analysis and decision-making.
In cognitive psychology, mindset is the cognitive process activated in a task. In addition to the field of cognitive psychology, the study of mindset is evident in the social sciences and other fields (such as positive psychology). 
Characteristic of this area of study is its fragmentation among academic disciplines.
`;

getSummary(sampleText);