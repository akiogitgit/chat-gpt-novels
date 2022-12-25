import Head from 'next/head'
import { useState } from 'react'
import styles from './index.module.css'
import Image from 'next/image'

export default function Home() {
  const [title, setTitle] = useState('サウナVSサバンナ')
  const [wordList, setWordList] = useState<string[]>(['オラウータン'])
  const [word, setWord] = useState<string>('')
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
    { label: '悲観的', trend: '全てが失敗し、泣いてしまう' },
    { label: '感動的', trend: 'お互いに感謝し、胸が熱くなる' },
    { label: '絶望的', trend: '悪党に襲われ、絶望する' },
  ]

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel='icon' href='/dog.png' />
      </Head>

      <main className={styles.main}>
        <Image
          src='/dog.png'
          className={styles.icon}
          width={50}
          height={50}
          alt=''
        />
        <h3>Name my pet</h3>

        <form onSubmit={onSubmit}>
          <p>タイトル</p>
          <input
            type='text'
            name='title'
            placeholder='Enter an title'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <p>単語</p>
          <input
            type='text'
            name='word'
            placeholder='Enter an word'
            value={word}
            onChange={e => setWord(e.target.value)}
          />
          <button
            type='button'
            onClick={() => {
              setWord('')
              setWordList([...wordList, word])
            }}
          >
            Add +
          </button>
          {wordList.map((word, i) => (
            <p
              key={i}
              onClick={() => {
                setWordList(wordList.filter((_, index) => index !== i))
              }}
            >
              {word}
            </p>
          ))}
          <div>
            <input
              type='radio'
              id='Consistency'
              checked={hasConsistency}
              onChange={() => setHasConsistency(true)}
            />
            <label htmlFor='Consistency'>一貫性がある</label>
            <input
              type='radio'
              id='inconsistent'
              checked={!hasConsistency}
              onChange={() => setHasConsistency(false)}
            />
            <label htmlFor='inconsistent'>話が変わる</label>
          </div>
          <input type='submit' value='Generate names' />
        </form>

        {/* <div className={styles.result} style={{ whiteSpace: 'pre-wrap' }}>
          {result}
        </div> */}

        {novels &&
          novels.map(res => (
            <p
              key={res}
              className={styles.result}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {res}
            </p>
          ))}

        {/* <button onClick={onSeeMore}>See more</button> */}
        {novels && (
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* {['楽観的', '悲観的', '感動的', '残酷で絶望的'].map(emotion => (
              <button key={emotion} onClick={() => onSeeMore(emotion)}>
                {emotion}な続きを見る
              </button>
            ))} */}
            {futureTrends.map(future => (
              <button
                key={future.label}
                onClick={() => onSeeMore(future.trend)}
              >
                {future.label}な続きを見る
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
