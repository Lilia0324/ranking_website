// OpenAI API Configuration
const config = {
    openaiApiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
    model: 'gpt-4-turbo-preview',
    maxTokens: 2000
};

module.exports = config; 