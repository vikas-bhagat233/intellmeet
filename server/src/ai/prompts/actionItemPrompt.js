export const actionItemPrompt = (transcriptText) => {
  return `You are an expert AI meeting assistant. Below is a meeting transcript.
Please extract all clear action items, tasks, and follow-ups mentioned in the transcript.
For each action item, extract:
- Task: The description of the task.
- AssignedTo: The person/speaker who is assigned the task (or empty string if not specified).
- Deadline: A deadline/date if mentioned (or null/empty if not mentioned).

Format your response strictly as a JSON array of objects, with no additional markdown wrapping or commentary:
[
  {
    "task": "Write task description here",
    "assignedTo": "Person Name",
    "deadline": "YYYY-MM-DD"
  }
]

Transcript:
"""
${transcriptText}
"""`
}
