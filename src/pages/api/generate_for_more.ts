import { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../libs/openai'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { previousNovel, futureStory, title } = req.body
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    // model: 'text-curie-001',
    // model: 'text-babbage-001',
    prompt: generatePrompt(title, previousNovel, futureStory),
    temperature: 0.6,
    max_tokens: 300,
  })

  res.status(200).json({ result: completion.data.choices[0].text })
}

const generatePrompt = (
  title: string,
  previousNovel: string,
  futureStory: string,
) => {
  return `あなたはこの${title}という小説の続きを書きます。ここから、大きく展開を変えます。非常に${futureStory}な展開で、会話の多い小説にして下さい。
  
  ${previousNovel}
  `
}
