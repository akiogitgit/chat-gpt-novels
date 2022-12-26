import { NextApiRequest, NextApiResponse } from 'next'
import { openai } from '../../libs/openai'

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `今からあなたは小説を書きます。タイトルは「ファイアウォールとファミリーマート」です。 の単語使って作成して下さい。続きが気になり非常に面白く、会話の多い小説にして下さい。`,
    temperature: 0.6,
    max_tokens: 100,
  })

  res.status(200).json({
    result: completion.data.choices[0].text.split('\n\n').slice(1).join('\n\n'),
  })
}
