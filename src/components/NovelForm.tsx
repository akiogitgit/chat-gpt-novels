import {
  Stack,
  TextInput,
  Flex,
  Badge,
  Button,
  Radio,
  Space,
  Loader,
} from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { FC, useState } from 'react'

type Props = {
  setNovel: (novel) => void
  onScrollToBottom: () => void
}

export const NovelForm: FC<Props> = ({ setNovel, onScrollToBottom }) => {
  const [title, setTitle] = useInputState('')
  const [word, setWord] = useInputState('')
  const [wordList, setWordList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 小説を生成
  const onGenerateNovel = async event => {
    setIsLoading(true)
    event.preventDefault()

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, words: wordList }),
      })

      const data = await response.json()
      setNovel({ title, body: [data.result] })
      onScrollToBottom()

      setTitle('')
      setWord('')
      setWordList([])
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={onGenerateNovel} className='mx-auto mt-8 max-w-300px'>
      <Stack spacing='md'>
        <TextInput
          label='タイトル'
          withAsterisk
          placeholder='タイトルを入力して下さい'
          value={title}
          onChange={setTitle}
          radius='md'
          required
        />
        <Stack spacing='xs'>
          <TextInput
            label='使う単語'
            placeholder='使用する単語を入力して下さい'
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
  )
}
