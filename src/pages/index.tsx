import Head from 'next/head'
import { useState } from 'react'
import Image from 'next/image'
import {
  Badge,
  Button,
  Flex,
  Paper,
  Radio,
  Space,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'

export default function Home() {
  const [title, setTitle] = useInputState('サウナVSサバンナ')
  const [wordList, setWordList] = useState<string[]>(['オラウータン'])
  const [word, setWord] = useInputState('')
  // const [result, setNovels] = useState('')
  const [novels, setNovels] = useState<string[]>()
  const [hasConsistency, setHasConsistency] = useState(true) // 話の一貫性

  // 小説を作成
  const onSubmit = async event => {
    event.preventDefault()
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, words: wordList }),
    })
    const data = await response.json()
    console.log(data)
    // setNovels(data.result)
    setNovels([data.result])
  }

  const onSeeMore = async (futureStory: string) => {
    const response = await fetch('/api/generate_for_more', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // previousNovel: result,
        // previousNovel: novels[novels.length - 1],

        // 一貫性があるか、展開が変わりやすいか
        previousNovel: hasConsistency
          ? novels.join('\n\n').slice(-900) // リクエストは1000文字が限度
          : novels[novels.length - 1],
        futureStory,
        title,
      }),
    })
    const data = await response.json()
    console.log('before: ', novels[novels.length - 1])
    console.log(data)
    // const newResult = `${result} \n\n ${data.result}`
    const newResult = [...novels, data.result]
    setNovels(newResult)
  }

  const futureTrends = [
    // { label: '楽観的', trend: '何もかも全て上手く行く' },
    // { label: '悲観的', trend: '全てが失敗する' },
    // { label: '感動的', trend: 'お互いに感謝する' },
    // { label: '残酷で絶望的', trend: '悪党に襲われる' },
    { label: '楽観的', trend: '何もかも全て上手く行き、みんなハッピーになる' },
    { label: '悲観的', trend: '全てが失敗し最悪の展開で、泣いてしまう' },
    { label: '感動的', trend: 'お互いに称えあい、生命に感謝する' },
    { label: '絶望的', trend: '悪党に襲われる' },
  ]

  return (
    <div>
      <Head>
        <title>Novel Generater</title>
        <link rel='icon' href='/dog.png' />
      </Head>

      <main className='mx-auto my-10 max-w-800px w-90vw'>
        {/* <h1 className='bg-gradient-to-r bg-clip-text font-bold from-emerald-500 via-indigo-400 to-violet-600 text-transparent text-center text-60px'>
          Novel Generator
        </h1> */}
        <h1 className='bg-gradient-to-r bg-clip-text font-bold from-emerald-500 via-violet-400 to-blue-600 text-transparent text-center text-60px'>
          Novel Generator
        </h1>
        {/* <h1 className='bg-gradient-to-r bg-clip-text font-bold from-emerald-500 via-blue-400 to-teal-600 text-transparent text-center text-60px'>
          Novel Generator
        </h1> */}
        <form onSubmit={onSubmit} className='mx-auto mt-8 max-w-300px'>
          <Stack spacing='md'>
            <TextInput
              label='タイトル'
              withAsterisk
              placeholder='Enter an title'
              value={title}
              onChange={setTitle}
              radius='md'
              required
            />
            <TextInput
              label='小説で使う単語'
              placeholder='Enter an word'
              value={word}
              onChange={setWord}
              radius='md'
            />

            <Flex gap='sm'>
              {wordList.map((word, i) => (
                <Badge
                  key={i}
                  onClick={() =>
                    setWordList(wordList.filter((_, index) => index !== i))
                  }
                  // color='cyan'
                  className='cursor-pointer bg-indigo-100 text-indigo-500 duration-150 hover:(bg-red-200 text-red-500) '
                >
                  {word}
                </Badge>
              ))}
            </Flex>

            <Button
              type='button'
              // color='cyan'
              className='bg-indigo-400/90 hover:bg-indigo-400'
              onClick={() => {
                setWord('')
                setWordList([...wordList, word])
              }}
              disabled={!word}
              radius='md'
            >
              Add +
            </Button>

            <Flex gap='xl'>
              <Radio
                label='一貫性がある'
                checked={hasConsistency}
                onChange={() => setHasConsistency(true)}
                color='indigo'
              />
              <Radio
                label='話が変わる'
                checked={!hasConsistency}
                onChange={() => setHasConsistency(false)}
                color='indigo'
              />
            </Flex>

            <Space />

            <button
              // className={`rounded-full border-emerald-700 border-b-4 hover:(border-white transform translate-y-4px)`}
              className={`${
                title &&
                'rounded-full border-emerald-700 border-b-4 hover:(border-white transform translate-y-4px)'
              }`}
            >
              <Button
                type='submit'
                color='teal'
                size='xl'
                radius='xl'
                className='w-full'
                disabled={!title}
              >
                Generate
              </Button>
            </button>
          </Stack>
        </form>
        <Space h='xl' />
        {novels && (
          <>
            <Paper
              p='xl'
              mt='xl'
              shadow='md'
              radius='md'
              // className='bg-emerald-50'
              className='bg-indigo-50'
            >
              {/* <Paper p='xl' mt='xl' shadow='xl' className='bg-gray-50'> */}
              <Title order={3} weight={600} align='center'>
                {title}
              </Title>
              <Space h='xl' />
              {novels.map(res => (
                <p key={res} style={{ whiteSpace: 'pre-wrap' }}>
                  {res}
                </p>
              ))}
            </Paper>

            <Space h='xl' />
            <Space h='xl' />

            <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
              {futureTrends.map(future => (
                <Button
                  color='teal'
                  key={future.label}
                  onClick={() => onSeeMore(future.trend)}
                  radius='md'
                >
                  {future.label}な続きを見る
                </Button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
