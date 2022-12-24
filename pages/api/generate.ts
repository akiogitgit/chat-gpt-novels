import { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: generatePrompt(req.body.animal),
    temperature: 0.6,
  })
  res.status(200).json({ result: completion.data.choices[0].text })
  // res.status(200).json({ result: completion.data })
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase()
  //   return `Suggest three names for an animal that is a superhero.

  // Animal: Cat
  // Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  // Animal: Dog
  // Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  // Animal: ${capitalizedAnimal}
  // Names:`
  return `今からあなたは小説を書きます。タイトルは「初登校」です。「学校」、「先生」の単語使って完成させてください`
}
