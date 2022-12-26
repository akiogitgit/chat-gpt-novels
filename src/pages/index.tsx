import { useCallback, useRef, useState } from 'react'
import { Button, Loader, Paper, Space, Title } from '@mantine/core'
import { Layout } from '../components/Layout'
import { NovelForm } from '../components/NovelForm'
import Image from 'next/image'

const futureTrends = [
  { label: '楽観的', trend: '何もかも全て上手く行き、みんなハッピーになる' },
  { label: '悲観的', trend: '全てが失敗し最悪の展開で、泣いてしまう' },
  { label: '感動的', trend: 'お互いに称えあい、生命に感謝する' },
  { label: '絶望的', trend: '悪党に襲われる' },
]

export default function Home() {
  const [novel, setNovel] = useState<{
    title: string
    hasConsistency: boolean
    body: string[]
  }>()
  const [isLoading, setIsLoading] = useState(false)

  const ref = useRef<HTMLDivElement>()
  // 画面下にスクロール
  const onScrollToBottom = useCallback(() => {
    ref!.current!.scrollIntoView({
      behavior: 'smooth',
    })
  }, [ref])

  // 続きを生成
  const onGenerateContinue = async (futureStory: string) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate_for_more', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // 一貫性があるか、展開が変わりやすいか
          previousNovel: novel.hasConsistency
            ? novel.body.join('\n\n').slice(-900) // リクエストは1000文字が限度
            : novel.body[novel.body.length - 1],
          futureStory,
          title: novel.title,
        }),
      })

      const data = await response.json()
      const newBody = [...novel.body, data.result]
      setNovel(state => {
        return { ...state, body: newBody }
      })

      onScrollToBottom()
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return (
    <Layout>
      <div className='text-center'>
        <Image src='/book.png' height={100} width={150} objectFit='contain' />
      </div>
      <h1 className='bg-gradient-to-r bg-clip-text font-bold from-emerald-500 via-violet-400 to-blue-600 text-transparent text-center text-50px'>
        Novel Generator
      </h1>

      <NovelForm setNovel={setNovel} onScrollToBottom={onScrollToBottom} />

      <Space h='xl' />

      {novel && (
        <>
          <Paper p='xl' mt='xl' shadow='md' radius='md' className='bg-gray-100'>
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
              <div
                key={future.label}
                className={`${
                  !isLoading &&
                  'rounded-10px border-emerald-700 border-b-4 hover:(border-white transform translate-y-4px)'
                }`}
              >
                <Button
                  color='teal'
                  onClick={() => onGenerateContinue(future.trend)}
                  radius='md'
                  leftIcon={
                    isLoading && <Loader variant='dots' color='indigo' />
                  }
                  disabled={isLoading}
                  className='w-full'
                >
                  {future.label}な続きを読む
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      <div id='bottom-of-site' ref={ref} />
    </Layout>
  )
}
