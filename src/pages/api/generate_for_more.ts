import { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../libs/openai'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(req.body.previousNovel),
    temperature: 0.6,
    max_tokens: 1000,
    // max_tokens: 100,
  })
  res.status(200).json({ result: completion.data.choices[0].text })
}

const generatePrompt = (previousNovel: string) => {
  return `あなたはこの小説の続きを書きます。さらに面白く新しい展開で、会話の多い小説にして下さい。
  
  ${previousNovel}
  `
}
