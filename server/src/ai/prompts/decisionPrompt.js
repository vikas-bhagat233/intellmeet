export const decisionPrompt = (transcriptText) => {
  return `You are an expert AI meeting assistant. Below is a meeting transcript.
Please analyze the meeting and extract the following:
- Decisions: A list of key decisions made during the meeting.
- Keywords: 3-5 high-level tags/keywords that represent the meeting topics.
- Sentiment: A single word representing the overall tone/sentiment of the meeting (e.g. Positive, Neutral, Collaborative, Tense).

Format your response strictly as a JSON object, with no additional markdown wrapping or commentary:
{
  "decisions": ["Decision 1", "Decision 2"],
  "keywords": ["tag1", "tag2"],
  "sentiment": "Positive"
}

Transcript:
"""
${transcriptText}
"""`
}
