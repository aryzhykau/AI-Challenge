require('dotenv').config();
const { OpenAI } = require('openai');
const inquirer = require('inquirer');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReport(input) {
  const prompt = `
    Analyze the following service/product. Provide a comprehensive, markdown-formatted report from multiple viewpoints—including business, technical, and user-focused perspectives.
    The service is: "${input}"

    Your report must include the following sections:
    - **Brief History**: Founding year, key milestones, etc.
    - **Target Audience**: Primary user segments.
    - **Core Features**: Top 2–4 key functionalities.
    - **Unique Selling Points**: Key differentiators.
    - **Business Model**: How the service makes money.
    - **Tech Stack Insights**: Any hints about technologies used.
    - **Perceived Strengths**: Mentioned positives or standout features.
    - **Perceived Weaknesses**: Cited drawbacks or limitations.

    Generate the report based on your knowledge of the service or the provided description.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 1024,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating report:', error.message);
    if (error.response) {
      console.error(error.response.data);
    }
    return null;
  }
}

async function main() {
  console.log('Welcome to the Service Analyzer!');

  if (!process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY is not set.');
    console.log('Please create a .env file and add your OpenAI API key.');
    return;
  }

  const { inputType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'inputType',
      message: 'What would you like to analyze?',
      choices: [
        { name: 'A known service name (e.g., Spotify, Notion)', value: 'serviceName' },
        { name: 'Raw service description text', value: 'rawText' },
      ],
    },
  ]);

  let userInput;
  if (inputType === 'serviceName') {
    const { serviceName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'serviceName',
        message: 'Enter the service name:',
        validate: (input) => input.trim() !== '' || 'Service name cannot be empty.',
      },
    ]);
    userInput = serviceName;
  } else {
    const { rawText } = await inquirer.prompt([
      {
        type: 'editor',
        name: 'rawText',
        message: 'Enter the service description (press Enter then Ctrl+D or Ctrl+Z on a new line to finish):',
        validate: (input) => input.trim() !== '' || 'Service description cannot be empty.',
      },
    ]);
    userInput = rawText;
  }

  console.log('\nGenerating your report, please wait...');
  
  const report = await generateReport(userInput);

  if (report) {
    console.log('\n--- AI-Generated Report ---');
    console.log(report);
    console.log('---------------------------\n');

    const { saveToFile } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'saveToFile',
            message: 'Do you want to save this report to a file?',
            default: false,
        },
    ]);

    if (saveToFile) {
        const defaultFileName = `${userInput.replace(/\\s+/g, '_').toLowerCase()}_report.md`;
        const { fileName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'fileName',
                message: 'Enter the file name:',
                default: defaultFileName,
            }
        ]);

        fs.writeFileSync(fileName, report);
        console.log(`Report saved to ${fileName}`);
    }
  }
}

main(); 