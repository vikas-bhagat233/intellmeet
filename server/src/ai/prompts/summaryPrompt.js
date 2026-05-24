export const summaryPrompt = (transcriptText) => {
  return `You are an expert AI meeting assistant. Below is a meeting transcript.
Please write a concise and high-quality summary of the main topics discussed, major points of agreement or disagreement, and overall conclusions.
The summary should be structured, easy to read, and formatted with bullet points.

Transcript:
"""
${transcriptText}
"""

Provide only the summary text without any introduction or markdown code block wrapping.`
}
