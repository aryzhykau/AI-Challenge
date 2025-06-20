# Audio Transcription, Summary, and Analysis Tool

This console application transcribes an audio file, provides a summary of the transcription, and extracts key analytics from it.

## Features

- Transcribes audio files using OpenAI's Whisper API.
- Summarizes the transcript using a GPT model.
- Analyzes the transcript to provide:
  - Total word count
  - Speaking speed (words per minute)
  - Frequently mentioned topics
- Saves the full transcription, summary, and analysis into separate files for each run.
- Outputs the summary and analysis directly to the console.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or higher is recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- An OpenAI API key.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>/Task11
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

1.  Before running the application, you need to set up your OpenAI API key.
2.  In the `Task11` directory, you will find a file named `.env`. If it doesn't exist, create it.
3.  Open the `.env` file and add your API key in the following format:

    ```
    OPENAI_API_KEY=your_super_secret_api_key
    ```

    Replace `your_super_secret_api_key` with your actual OpenAI API key.

## Usage

Run the application from the command line, providing the path to the audio file you want to process using the `--file` (or `-f`) flag.

### Example

```bash
node index.js --file ./CAR0004.mp3
```

The application will then:
1.  Transcribe the audio.
2.  Generate a summary.
3.  Perform an analysis.
4.  Print the summary and analysis to the console.
5.  Save three files in the `Task11` directory:
    - `transcription-YYYY-MM-DDTHH-mm-ss-SSSZ.md`
    - `summary-YYYY-MM-DDTHH-mm-ss-SSSZ.md`
    - `analysis-YYYY-MM-DDTHH-mm-ss-SSSZ.json`
