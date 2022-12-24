import { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../libs/openai'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(req.body.previousNovel, req.body.emotion),
    temperature: 0.6,
    // max_tokens: 1000,
    max_tokens: 300,
  })
  res.status(200).json({ result: completion.data.choices[0].text })
}

const generatePrompt = (previousNovel: string, emotion: string) => {
  // return `あなたはこの小説の続きを書きます。さらに面白く新しい展開で、非常に${emotion}で、会話の多い小説にして下さい。
  // return `あなたはこの小説の続きを書きます。さらに面白く新しい展開で、非常に${emotion}で、会話の多い小説にして下さい。
  // return `あなたはこの小説の続きを書きます。ここから、新しく非常に${emotion}な展開で、会話の多い小説にして下さい。
  return `あなたはこの小説の続きを書きます。ここから、大きく展開を変えます。非常に${emotion}な展開で、会話の多い小説にして下さい。
  
  ${previousNovel}
  `
}
