import OpenAI from 'openai'

export default new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
