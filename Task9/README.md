# AI Service Analyzer

This console application generates a comprehensive, markdown-formatted report on a service or product from multiple viewpoints, including business, technical, and user-focused perspectives. It uses the OpenAI API to analyze either a known service name or raw descriptive text provided by the user.

## Prerequisites

- Node.js (v14 or higher)
- npm (usually comes with Node.js)
- An OpenAI API key

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd Task9
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

The application requires an OpenAI API key to function.

1.  Create a file named `.env` in the `Task9` directory.
2.  Add your OpenAI API key to the `.env` file as follows:

    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

    **Important:** Your API key is sensitive information. The `.gitignore` file is configured to prevent the `.env` file from being committed to Git.

## Usage

Run the application using the following command:

```bash
npm start
```

The application will then prompt you to choose between two input methods:
1.  **A known service name:** Enter the name of a well-known service (e.g., "Spotify", "Notion", "Slack").
2.  **Raw service description text:** Paste or type a description of the service you want to analyze. When using the text editor, press `Enter` then `Ctrl+D` (on macOS/Linux) or `Ctrl+Z` on a new line (on Windows) to submit the text.

After generating the report, the application will display it in the console and ask if you want to save it to a markdown file.

### Example

```
$ npm start

> service-analyzer@1.0.0 start
> node index.js

Welcome to the Service Analyzer!
? What would you like to analyze? › - Use arrow keys. Return to submit.
❯   A known service name (e.g., Spotify, Notion)
    Raw service description text 