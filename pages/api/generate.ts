import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// export default async function (req: NextApiRequest, res: NextApiResponse) {
//   const completion = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: generatePrompt(req.body.animal),
//     temperature: 0.6,
//     max_tokens: 1000,
//   })
//   res.status(200).json({ result: completion.data.choices[0].text })
// }
// const generatePrompt = (animal) => {
//   const capitalizedAnimal =
//     animal[0].toUpperCase() + animal.slice(1).toLowerCase()
//   return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って、会話の多い小説を作成して下さい`
// }

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: generatePrompt(req.body.title, req.body.words),
    temperature: 0.6,
    max_tokens: 1000,
  })
  res.status(200).json({ result: completion.data.choices[0].text })
}

const generatePrompt = (title: string, words: string[]) => {
  let wordModified = ''
  // for (const word of words) {
  //   wordModified += `「${word}」、`
  // }
  for (let i = 0; i < words.length; i++) {
    wordModified += `「${words[i]}」、`
  }
  //   return `Suggest three names for an animal that is a superhero.

  // Animal: Cat
  // Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  // Animal: Dog
  // Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  // Animal: ${capitalizedAnimal}
  // Names:`
  // return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って完成させてください`
  // return `私はごはんが大好きですが、もっと美味しく食べるにはどうすれば良いですか？`
  // return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って、頭のいかれた小説を完成させてください`
  // return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って、続きが気になる非常に面白い小説を作成して下さい`
  // return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って、会話の多い小説を作成して下さい`
  return `今からあなたは小説を書きます。タイトルは「${title}」です。${wordModified}の単語使って、続きが気になる非常に面白く、会話の多い小説を作成して下さい`
}
