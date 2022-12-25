import Head from 'next/head'
import { useState } from 'react'
import {
  Badge,
  Button,
  Flex,
  Loader,
  Paper,
  Radio,
  Space,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'

export default function Home() {
  const [title, setTitle] = useInputState('')
  const [word, setWord] = useInputState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [hasConsistency, setHasConsistency] = useState(true) // 話の一貫性
  const [novel, setNovel] = useState<{ title: string; body: string[] }>()
  const [isLoading, setIsLoading] = useState(false)

  // 小説を生成
  const onGenerateNovel = async event => {
    setIsLoading(true)
    event.preventDefault()

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, words: wordList }),
    })

    const data = await response.json()
    setNovel({ title, body: [data.result] })
    setIsLoading(false)
  }

  // 続きを生成
  const onGenerateContinue = async (futureStory: string) => {
    setIsLoading(true)

    const response = await fetch('/api/generate_for_more', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // 一貫性があるか、展開が変わりやすいか
        previousNovel: hasConsistency
          ? novel.body.join('\n\n').slice(-900) // リクエストは1000文字が限度
          : novel.body[novel.body.length - 1],
        futureStory,
        title,
      }),
    })

    const data = await response.json()
    const newResult = [...novel.body, data.result]
    setNovel({ title, body: newResult })
    setIsLoading(false)
  }

  const futureTrends = [
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

      <main className='mx-auto my-10 max-w-700px w-90vw'>
        <h1 className='bg-gradient-to-r bg-clip-text font-bold from-emerald-500 via-violet-400 to-blue-600 text-transparent text-center text-50px'>
          Novel Generator
        </h1>

        <form onSubmit={onGenerateNovel} className='mx-auto mt-8 max-w-300px'>
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
            <Stack spacing='xs'>
              <TextInput
                label='使う単語'
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
                    className='cursor-pointer bg-indigo-100/80 text-indigo-500 duration-150 hover:(bg-indigo-100) '
                  >
                    ✕ {word}
                  </Badge>
                ))}
              </Flex>

              <Button
                type='button'
                className='bg-indigo-400/90 hover:bg-indigo-400'
                onClick={() => {
                  setWord('')
                  setWordList([...wordList, word])
                }}
                disabled={!word}
                radius='md'
              >
                追加 +
              </Button>
            </Stack>

            <Stack spacing='xs'>
              <label className='text-sm'>小説の展開</label>
              <Flex gap='xl'>
                <Radio
                  label='おだやか'
                  checked={hasConsistency}
                  onChange={() => setHasConsistency(true)}
                  color='indigo'
                />
                <Radio
                  label='はげしい'
                  checked={!hasConsistency}
                  onChange={() => setHasConsistency(false)}
                  color='indigo'
                />
              </Flex>
            </Stack>

            <Space />

            <div
              className={`${
                title &&
                !isLoading &&
                'rounded-full border-emerald-700 border-b-4 hover:(border-white transform translate-y-4px)'
              }`}
            >
              <Button
                type='submit'
                color='teal'
                size='xl'
                radius='xl'
                className='w-full'
                leftIcon={isLoading && <Loader variant='dots' color='indigo' />}
                disabled={!title || isLoading}
              >
                小説を生成
              </Button>
            </div>
          </Stack>
        </form>

        <Space h='xl' />

        {novel && (
          <>
            <Paper
              p='xl'
              mt='xl'
              shadow='md'
              radius='md'
              className='bg-gray-100'
            >
              <Title order={3} weight={600} align='center'>
                {novel.title}
              </Title>
              <Space h='xl' />
              {novel?.body?.map(res => (
                <p key={res} style={{ whiteSpace: 'pre-wrap' }}>
                  {res}
                </p>
              ))}
            </Paper>

            <Space h='xl' />
            <Space h='xl' />

            <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
              {futureTrends.map(future => (
                <Button
                  color='teal'
                  key={future.label}
                  onClick={() => onGenerateContinue(future.trend)}
                  radius='md'
                  leftIcon={
                    isLoading && <Loader variant='dots' color='indigo' />
                  }
                  disabled={isLoading}
                >
                  {future.label}な続きを読む
                </Button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
