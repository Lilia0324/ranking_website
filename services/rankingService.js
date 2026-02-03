const OpenAI = require('openai');
const DatabaseService = require('./databaseService');
const axios = require('axios');

class RankingService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            console.error('Warning: OPENAI_API_KEY not set in environment variables');
        }
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.dbService = new DatabaseService();
    }

    async generateRankings(region, serviceType, year, month) {
        try {
            console.log('Starting ranking generation:', { region, serviceType, year, month });
            
            // Check if rankings already exist in database
            console.log('Checking database for existing rankings...');
            const existingRankings = await this.dbService.checkRankingsExist(region, serviceType, year, month);
            console.log('Database check result:', existingRankings);

            if (existingRankings) {
                console.log('Fetching existing rankings from database...');
                const rankings = await this.dbService.getRankings(region, serviceType, year, month);
                console.log(`Retrieved ${rankings.length} ranking records from database`);
                return rankings.map(record => this.formatRankingData(record));
            }

            // If no data in database, generate new rankings using OpenAI API
            console.log('No data in database, generating new rankings using OpenAI API...');
            
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY not set, cannot generate new rankings');
            }

            const prompt = this.generatePrompt(region, serviceType, 15);
            console.log('Sending request to OpenAI API...');

            const completion = await this.openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: "You are a business research assistant specializing in HR tech and global employment services. Provide accurate, verifiable information only."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 4000
            });

            const content = completion.choices[0].message.content;
            console.log('Received OpenAI API response');

            // Parse and validate ranking data
            const rankings = await this.parseRankings(content);
            console.log(`Successfully generated ${rankings.length} ranking records`);

            // Save to database
            console.log('Saving ranking data to database...');
            await this.dbService.saveRankings(rankings, region, serviceType, year, month);
            console.log('Ranking data saved to database');

            // Read from database and return to ensure consistent format
            const savedRankings = await this.dbService.getRankings(region, serviceType, year, month);
            return savedRankings.map(record => this.formatRankingData(record));

        } catch (error) {
            console.error('Error generating rankings:', {
                error: error.message,
                stack: error.stack,
                params: { region, serviceType, year, month }
            });
            throw error;
        }
    }

    generatePrompt(region, serviceType, count = 15) {
        console.log('Generating prompt:', { region, serviceType, count });
        const serviceTypeText = serviceType === 'eor' ? 'Employer of Record (EOR)' : 'Payroll';
        const prompt = `Generate a ranking of ${count} real and verifiable ${serviceTypeText} service providers that are currently operating in ${region}. 

Requirements:
1. ONLY include real companies that actually exist and provide ${serviceTypeText} services in ${region}
2. Each company MUST have a real, active website
3. All information must be factual and verifiable
4. Focus on well-known, established companies in the industry
5. Include both global providers operating in ${region} and strong local providers
6. Ensure all website URLs are correct and active
7. Prefer companies with clear web presence and verifiable services

Research and Ranking Process:
1. Search Phase:
   - Search for "[${serviceTypeText}] service provider in ${region}" using Google, Bing, and LinkedIn
   - From the search results, visit each company's website in order
   - Identify the first 20 companies that actually provide ${serviceTypeText} services in ${region}

2. Scoring Phase:
   - Assign scores based on ranking in each search engine: 1st = 20 points, 2nd = 19 points, ..., 20th = 1 point
   - Apply these weights to each score:
     * LinkedIn results: 40% weight
     * Google results: 30% weight
     * Bing results: 30% weight
   - Sum the weighted scores from all search engines to get each company's final score

3. Verification Phase:
   - Visit each company's website
   - Verify they actively provide ${serviceTypeText} services in ${region}
   - Confirm website functionality and service information
   - Check for recent activity and updates
   - Validate contact information and regional presence

4. Final Ranking:
   - Rank companies based on their final weighted scores
   - Ensure all information is current and accurate
   - Double-check all website URLs are correct and functional

Return ONLY a valid JSON array with exactly this structure, no other text:
[
    {
        "company_name": "Real Company Name",
        "description": "Factual 2-3 sentence description based on their actual services",
        "strengths": ["Real strength 1", "Real strength 2", "Real strength 3"],
        "website": "https://real-company-website.com"
    }
]`;
        return prompt;
    }

    async validateWebsite(url) {
        try {
            // Check URL format first
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                console.log(`Invalid URL format: ${url}`);
                return false;
            }

            const response = await axios.get(url, {
                timeout: 10000,
                maxRedirects: 5,
                validateStatus: function (status) {
                    return status >= 200 && status < 400;
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            return true;
        } catch (error) {
            console.error(`Website validation failed: ${url}`, error.message);
            return false;
        }
    }

    async parseRankings(content) {
        try {
            console.log('Parsing OpenAI response:', content);
            // Clean response content, keep only JSON part
            const jsonStart = content.indexOf('[');
            const jsonEnd = content.lastIndexOf(']') + 1;
            if (jsonStart === -1 || jsonEnd === 0) {
                throw new Error('No valid JSON array found in response');
            }
            const jsonContent = content.substring(jsonStart, jsonEnd);
            const parsed = JSON.parse(jsonContent);
            
            // Validate website for each company
            const validatedRankings = [];
            for (const company of parsed) {
                if (await this.validateWebsite(company.website)) {
                    validatedRankings.push(company);
                } else {
                    console.warn(`Skipping company with invalid website: ${company.company_name}`);
                }
            }
            
            console.log('Successfully parsed and validated response:', validatedRankings);
            return validatedRankings;
        } catch (error) {
            console.error('Error parsing OpenAI response:', {
                error: error.message,
                content
            });
            throw new Error('Failed to parse ranking data: ' + error.message);
        }
    }

    formatRankingData(dbRecord) {
        try {
            console.log('Formatting database record:', dbRecord);
            // Support both new and old field formats
            const formatted = {
                // Tool/app name (new) or company name (old)
                tool_name: dbRecord.tool_name || dbRecord.company_name,
                company_name: dbRecord.tool_name || dbRecord.company_name,
                // Description
                tool_description: dbRecord.tool_description || dbRecord.company_description,
                description: dbRecord.tool_description || dbRecord.company_description,
                // Features/strengths
                features: typeof dbRecord.features === 'string' ? JSON.parse(dbRecord.features) : (dbRecord.features || dbRecord.strengths),
                strengths: typeof dbRecord.features === 'string' ? JSON.parse(dbRecord.features) : (dbRecord.features || (typeof dbRecord.strengths === 'string' ? JSON.parse(dbRecord.strengths) : dbRecord.strengths)),
                // Website link
                website_link: dbRecord.website_link,
                website: dbRecord.website_link
            };
            console.log('Formatted data:', formatted);
            return formatted;
        } catch (error) {
            console.error('Error formatting data:', {
                error: error.message,
                record: dbRecord
            });
            throw new Error('Failed to format ranking data: ' + error.message);
        }
    }

    async getRankings(region, serviceType, year, month) {
        try {
            const rankings = await this.generateRankings(region, serviceType, year, month);
            return rankings;
        } catch (error) {
            console.error('Error getting rankings:', error);
            throw error;
        }
    }
}

module.exports = RankingService; 