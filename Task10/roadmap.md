# Project Roadmap

This document outlines the steps to complete the product search tool task.

- [x] **Project Setup**
    - [x] Initialize a new Node.js project in the `Task10` directory.
    - [x] Create `products.json` with the product dataset.
    - [x] Create the main application file `index.js`.
    - [x] Create `.gitignore` to exclude `node_modules` and `.env`.

- [x] **Application Logic**
    - [x] Install required npm packages (`openai`, `dotenv`, `readline-sync`).
    - [x] Load the product dataset from `products.json`.
    - [x] Implement a function to get the user's search query from the console.
    - [x] Set up the OpenAI API client using the API key from environment variables.
    - [x] Define the tool/function for OpenAI to use for returning filtered products.
    - [x] Construct the prompt to send to the OpenAI API, including the user query, the product data, and the function definition.
    - [x] Implement the main loop to get input, call OpenAI, and display the results.

- [x] **Documentation**
    - [x] Create `README.md` with clear instructions on how to set up and run the application.
    - [x] Create `sample_outputs.md` with at least two different examples of user queries and the application's output.

- [x] **Final Review**
    - [x] Ensure all requirements from the task description are met.
    - [x] Verify that the OpenAI API key is not hardcoded.
    - [x] Test the application with various queries.
    - [x] Mark all checkboxes in this roadmap as complete. 