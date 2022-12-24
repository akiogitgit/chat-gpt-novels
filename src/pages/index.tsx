import Head from 'next/head'
import { useState } from 'react'
import styles from './index.module.css'
import Image from 'next/image'

export default function Home() {
  const [title, setTitle] = useState('ししゃもと落花生')
  const [wordList, setWordList] = useState<string[]>(['やまんば'])
  const [word, setWord] = useState<string>('')
  const [result, setResult] = useState('')

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
    setResult(data.result)
  }

  const onSeeMore = async () => {
    const response = await fetch('/api/generate_for_more', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ previousNovel: result }),
    })
    const data = await response.json()
    console.log(data)
    const newResult = `${result} \n\n ${data.result}`
    setResult(newResult)
  }
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

          <input type='submit' value='Generate names' />
        </form>

        <div className={styles.result} style={{ whiteSpace: 'pre-wrap' }}>
          {result}
        </div>

        <button onClick={onSeeMore}>See more</button>
      </main>
    </div>
  )
}
