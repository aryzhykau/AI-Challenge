require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(audioFilePath, outputFilePath) {
  const audioFileStream = fs.createReadStream(audioFilePath);
  const transcript = await openai.audio.transcriptions.create({
    file: audioFileStream,
    model: 'whisper-1',
  });

  fs.writeFileSync(outputFilePath, transcript.text);
  console.log(`Transcription saved to ${outputFilePath}`);

  return transcript;
}

async function summarizeTranscript(transcriptText, outputFilePath) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant that summarizes texts.',
      },
      {
        role: 'user',
        content: `Please summarize the following text:\n\n${transcriptText}`,
      },
    ],
  });

  const summary = response.choices[0].message.content;

  fs.writeFileSync(outputFilePath, summary);
  console.log(`Summary saved to ${outputFilePath}`);

  return summary;
}

async function analyzeTranscript(transcriptText, audioFilePath, outputFilePath) {
  const wordCount = transcriptText.split(/\s+/).length;
  const durationInSeconds = await getAudioDurationInSeconds(audioFilePath);
  const durationInMinutes = durationInSeconds / 60;
  const speakingSpeedWpm = Math.round(wordCount / durationInMinutes);

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert at analyzing text. Your task is to identify the main topics mentioned in the text and count their mentions. Respond with a JSON array of objects, where each object has a "topic" and "mentions" key. Provide at least 3 topics. The JSON response should look like this: [{"topic": "example topic", "mentions": 4}]`,
      },
      {
        role: 'user',
        content: `Analyze the following text and identify the top 3 or more frequently mentioned topics and their mention counts:\n\n${transcriptText}`,
      },
    ],
  });

  let frequentlyMentionedTopics = [];
  try {
    frequentlyMentionedTopics = JSON.parse(response.choices[0].message.content);
  } catch(e) {
    console.error("Failed to parse topics from GPT response. The response was:", response.choices[0].message.content);
  }


  const analysis = {
    word_count: wordCount,
    speaking_speed_wpm: speakingSpeedWpm,
    frequently_mentioned_topics: frequentlyMentionedTopics,
  };

  fs.writeFileSync(outputFilePath, JSON.stringify(analysis, null, 2));
  console.log(`Analysis saved to ${outputFilePath}`);

  return analysis;
}

async function main(audioFilePath) {
  try {
    const isProvidedAudio = path.basename(audioFilePath) === 'CAR0004.mp3';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const transcriptionFileName = isProvidedAudio ? 'transcription.md' : `transcription-${timestamp}.md`;
    const summaryFileName = isProvidedAudio ? 'summary.md' : `summary-${timestamp}.md`;
    const analysisFileName = isProvidedAudio ? 'analysis.json' : `analysis-${timestamp}.json`;

    const transcriptionFilePath = path.join(__dirname, transcriptionFileName);
    const summaryFilePath = path.join(__dirname, summaryFileName);
    const analysisFilePath = path.join(__dirname, analysisFileName);

    console.log('Starting transcription...');
    const transcript = await transcribeAudio(audioFilePath, transcriptionFilePath);
    
    console.log('Transcription finished. Analyzing...');
    const analysis = await analyzeTranscript(transcript.text, audioFilePath, analysisFilePath);

    console.log('Analysis finished. Summarizing...');
    const summary = await summarizeTranscript(transcript.text, summaryFilePath);

    console.log('--- Summary ---');
    console.log(summary);
    console.log('--- Analysis ---');
    console.log(JSON.stringify(analysis, null, 2));

  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

const argv = yargs(hideBin(process.argv))
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'Path to the audio file',
    demandOption: true,
  })
  .argv;

main(argv.file);
