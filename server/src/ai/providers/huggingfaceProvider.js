import axios from 'axios'

export const generateText = async (prompt, systemPrompt = '') => {
  const model = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2'
  const token = process.env.HF_API_KEY || ''
  
  if (!token) {
    console.warn('⚠️ HF_API_KEY is not defined. Falling back to simulated/mock AI response.')
    return simulateGeneration(prompt)
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: systemPrompt ? `<s>[INST] ${systemPrompt}\n\n${prompt} [/INST]` : `<s>[INST] ${prompt} [/INST]`,
        parameters: { max_new_tokens: 1000, return_full_text: false }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    
    let result = ''
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      result = response.data[0].generated_text
    } else if (response.data?.generated_text) {
      result = response.data.generated_text
    } else if (typeof response.data === 'string') {
      result = response.data
    } else {
      result = JSON.stringify(response.data)
    }

    // Strip out prompt echo if HuggingFace returned it
    if (result.includes('[/INST]')) {
      result = result.split('[/INST]').pop()
    }

    return result.trim()
  } catch (error) {
    console.error('❌ HuggingFace API error:', error.message)
    return simulateGeneration(prompt)
  }
}

function simulateGeneration(prompt) {
  console.log('🤖 Simulating HuggingFace response...')
  if (prompt.includes('JSON array of objects') && prompt.includes('action items')) {
    return JSON.stringify([
      {
        task: "Refactor peer room styling and connection handling",
        assignedTo: "Test User",
        deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
      },
      {
        task: "Verify WebRTC multi-user peer audio integration",
        assignedTo: "Vikas",
        deadline: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0]
      }
    ])
  } else if (prompt.includes('JSON object') && prompt.includes('decisions')) {
    return JSON.stringify({
      decisions: [
        "Adopt Serverless Direct Media Room structure to eliminate external audio/video server dependencies.",
        "Include color token color: var(--ink) inside all white card components to ensure proper WCAG accessibility."
      ],
      keywords: ["WebRTC", "Direct Mode", "UX Design", "Accessibility"],
      sentiment: "Collaborative"
    })
  } else {
    return `IntellMeet Meeting Summary:
- Discussed serverless video room deployment and simple-peer connection negotiation.
- Addressed accessibility text contrast on the participants panel.
- Confirmed next steps for AI integration and dynamic meeting insights.`
  }
}
