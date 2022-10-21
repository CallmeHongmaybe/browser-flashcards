import { useRef, useState } from 'react'
import Image from 'next/image';
import GoogleDocLogo from '../public/Google_Docs_Logo.svg';
import { useRouter } from 'next/router';

export default function InputFunction() {

    let textField = useRef(null);

    let router = useRouter()

    let [disable, setDisable] = useState(false)
    let [listOfWords, setListOfWords] = useState([])

    const translateWords = (e) => {
        // this block of code goes to the new page
        
        router.push({
            pathname: '/editor/new',
            // hash the list of words here first 
            query: { words: JSON.stringify(listOfWords) },
        })
    }

    return (
        <div className='flex self-center justify-center laptop:space-x-6 items-center tablet:space-x-0 phone:space-x-0  mt-6 phone:mt-10 laptop:w-2/3 tablet:w-full phone:w-full laptop:flex-row tablet:flex-col phone:flex-col relative'>
            <div className='flex relative laptop:w-2/3 tablet:w-full phone:w-full'>
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <Image src={GoogleDocLogo} width={30} height={30} />
                </div>
                <textarea className="pl-12 p-4 border shadow-sm flex-grow"
                    ref={el => {
                        if (el) textField = el;
                    }}
                    onChange={e => {
                        let changingWordList = e.target.value.split(/[,\n]+[\W]*/g)
                        setListOfWords(changingWordList)

                        if (changingWordList.length > 20) setDisable(true)
                        else setDisable(false)
                    }}
                />
                {/* {disable ? <p>Please only enter 5 words at most</p> : null} */}
            </div>
            <button
                className='bg-slate-900 self-center hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 laptop:px-6 phone:px-2 rounded-lg laptop:mt-0 tablet:mt-4 phone:mt-2 disabled:bg-slate-400'
                disabled={disable}
                onClick={e => translateWords(e)}
            >
                Create deck
            </button>
        </div>
    )
}