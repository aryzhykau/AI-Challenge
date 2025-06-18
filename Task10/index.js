require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const readlineSync = require('readline-sync');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Load the dataset
const products = JSON.parse(fs.readFileSync('products.json', 'utf-8'));

// Define the function for OpenAI to call
const tools = [
  {
    type: 'function',
    function: {
      name: 'show_filtered_products',
      description: 'Displays a list of products that match the user\'s filtering criteria.',
      parameters: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                category: { type: 'string' },
                price: { type: 'number' },
                rating: { type: 'number' },
                in_stock: { type: 'boolean' },
              },
              required: ['name', 'category', 'price', 'rating', 'in_stock'],
            },
          },
        },
        required: ['products'],
      },
    },
  },
];

async function main() {
  console.log('Welcome to the AI Product Search!');
  console.log('Type "exit" to quit.');

  while (true) {
    const userInput = readlineSync.question('Enter your search query: ');
    if (userInput.toLowerCase() === 'exit') {
      break;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that filters a product list based on user queries. The user will provide a query and a JSON object of products. You must identify which products from the JSON object match the query and call the \`show_filtered_products\` function with only the matching products. The available products are: ${JSON.stringify(products)}`,
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        tools: tools,
        tool_choice: 'auto',
      });

      const responseMessage = response.choices[0].message;

      if (responseMessage.tool_calls) {
        const toolCall = responseMessage.tool_calls[0];
        if (toolCall.function.name === 'show_filtered_products') {
          const filteredProducts = JSON.parse(toolCall.function.arguments).products;
          
          if (filteredProducts.length > 0) {
            console.log('\nFiltered Products:');
            filteredProducts.forEach((product, index) => {
              console.log(`${index + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${product.in_stock ? 'In Stock' : 'Out of Stock'}`);
            });
          } else {
            console.log('\nNo products found matching your criteria.');
          }
        }
      } else {
        console.log("\nI couldn't determine which products to filter. Please try rephrasing your query.");
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
    console.log('\n');
  }
}

main(); 