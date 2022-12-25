import { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../libs/openai'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(req.body.title, req.body.words),
    temperature: 0.6,
    max_tokens: 300,
  })

  // 。\n\n「○○」\n\n　このようなレスポンスになるので対策。
  res.status(200).json({
    result: completion.data.choices[0].text.split('\n\n').slice(1).join('\n\n'),
  })
}

const generatePrompt = (title: string, words: string[]) => {
  let wordModified = ''
  for (let i = 0; i < words.length; i++) {
    wordModified += `「${words[i]}」、`
  }

  return `今からあなたは小説を書きます。タイトルは「${title}」です。${wordModified}の単語使って作成して下さい。続きが気になり非常に面白く、会話の多い小説にして下さい。タイトルは書かず、本文から書いてください。`
}
