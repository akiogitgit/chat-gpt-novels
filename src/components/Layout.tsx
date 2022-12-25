import Head from 'next/head'
import { FC } from 'react'

type Props = {
  title?: string
  children: React.ReactNode
}

export const Layout: FC<Props> = ({ title = 'Novel Generater', children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/dog.png' />
      </Head>

      <main className='mx-auto my-10 max-w-700px w-90vw'>{children}</main>
    </div>
  )
}
