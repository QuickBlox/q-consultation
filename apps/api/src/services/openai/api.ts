import { Configuration, OpenAIApi } from 'openai'
import FormData from 'form-data'

class OpenAIFormData extends FormData {
  append(key: string, value: string | number | File): void {
    if (typeof value === 'object' && 'buffer' in value && 'filename' in value) {
      super.append(key, value.buffer, { filename: value.filename })
    } else {
      super.append(key, value)
    }
  }
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  formDataCtor: OpenAIFormData,
})

export default new OpenAIApi(configuration)
