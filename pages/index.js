import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import InputFunction from '../components/Input'

// there will be a word bank where user pastes in a word from a website to the extension UI of this app 

// user will supply a list of words and translated by Google 

// then the user can edit each card one by one 

// before it gets shipped off to Anki or Quizlet. 

export default function Home() {
  return (
    <div className="container m-auto">
      <Head>
        <title>Language flashcard generator</title>
        <meta name="description" content="Language flashcard generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex flex-col justify-center" style={{ minHeight: '70vh' }}>
        <div>
          <h1 className="text-slate-900 font-extrabold phone:text-4xl tablet:text-5xl laptop:text-6xl tracking-tight text-center dark:text-white">The flashcard generator for language learners.</h1>
          <p className='mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400'>
            Paste a word list or a paragraph here ! 
          </p>
        </div>
        <InputFunction/>

      </main>

      <footer className="flex px-8 py-8 font-semibold tracking-wider leading-6 justify-center items-center text-black">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-1/5 phone:w-full tablet:w-full justify-evenly tablet:flex-col phone:flex-col"
        >
          <span>Powered by{' '}</span>
          <Image src="/vercel-dark.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  )

}
