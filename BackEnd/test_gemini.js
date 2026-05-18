require("dotenv").config({ path: "./.env" });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const test = async () => {
    try {
        const systemInstruction = `You are an AI generating JSON.`;
        const prompt = `Return {"success": true}`;

        const model = ai.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction 
        });

        const response = await model.generateContent(prompt);
        console.log(await response.response.text());
    } catch (e) {
        console.error("ERROR", e);
    }
};

test();

