# Task 10: AI-Powered Product Search

This is a console-based product search tool that uses the OpenAI API to filter products based on natural language queries.

## Features

-   Search for products using natural language.
-   Filters products based on criteria like category, price, rating, and stock availability.
-   Leverages OpenAI's function calling feature to perform the filtering, without any hardcoded filtering logic in the application.

## Prerequisites

-   Node.js (v18 or later recommended)
-   An OpenAI API key

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd AI-Challenge/Task10
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    -   Create a new file named `.env` in the `Task10` directory.
    -   Open the `.env` file and add your OpenAI API key like this:
        ```
        OPENAI_API_KEY=your_openai_api_key_here
        ```
    -   Replace `your_openai_api_key_here` with your actual OpenAI API key.

## How to Run

To start the application, run the following command in your terminal from the `Task10` directory:

```bash
node index.js
```

The application will then prompt you to enter your search query in natural language.

**Example:**

```
> Enter your search query: I'm looking for electronics under $200 that are in stock
```

The tool will process your request, call the OpenAI API, and display the filtered list of products. 