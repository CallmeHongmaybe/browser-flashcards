import { useRef, useState } from 'react'
import Image from 'next/image';
import GoogleDocLogo from '../public/Google_Docs_Logo.svg';
import GoogleSheetsLogo from '../public/Google_Sheets_Logo.svg';
import { useRouter } from 'next/router';
import Tooltip from './Tooltip'

const INPUT_TYPE = { 
    LIST_INPUT: 'LIST_INPUT', 
    DOC_INPUT: 'DOC_INPUT' 
}

export default function InputFunction() {

    let textField = useRef(null);

    let router = useRouter()

    let [disable, setDisable] = useState(false)
    let [listOfWords, setListOfWords] = useState() 
    let [inputType, setInputType] = useState(INPUT_TYPE.DOC_INPUT)  

    const processWords = (listOfWords, inputType) => {
        // this block of code goes to the new page
        if (inputType == INPUT_TYPE.DOC_INPUT) { 
            router.push({
                pathname: '/choose_deck',
                // hash the list of words here first 
                query: { paragraph: listOfWords },
            })
        }
        else { 
            listOfWords = listOfWords.split(/[,\n]+[\W]*/g)
            router.push({
                pathname: '/editor',
                // hash the list of words here first 
                query: { words: JSON.stringify(listOfWords) },
            })
        }
    }

    let toggleOnClick = () => {
        if (inputType == INPUT_TYPE.DOC_INPUT) { 
            setInputType(INPUT_TYPE.LIST_INPUT)
        }
        else setInputType(INPUT_TYPE.DOC_INPUT)
    }

    return (
        <div className='flex self-center justify-center laptop:space-x-6 items-center tablet:space-x-0 phone:space-x-0 mt-6 phone:mt-10 laptop:w-2/3 tablet:w-full phone:w-full laptop:flex-row tablet:flex-col phone:flex-col relative'>
            <div className='flex relative laptop:w-2/3 tablet:w-full phone:w-full'>
                <div 
                className="flex absolute inset-y-0 left-0 items-center ml-3 z-1"
                >
                    {inputType == INPUT_TYPE.DOC_INPUT
                    ? <Tooltip title={"Paragraph as input"} onClick={toggleOnClick}>
                        <Image src={GoogleDocLogo} width={35} height={35} alt="Paragraph as input" />
                    </Tooltip>
                    : <Tooltip title={"Word list as input"} onClick={toggleOnClick}>
                        <Image src={GoogleSheetsLogo} width={35} height={35} alt="Word list as input" />
                    </Tooltip>
                }
                </div>
                <textarea className="pl-12 p-4 border shadow-sm flex-grow"
                    ref={el => {
                        if (el) textField = el;
                    }}
                    onChange={e => {
                        setListOfWords(e.target.value)
                    }}
                />
            </div>
            <button
                className='bg-slate-900 self-center hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 laptop:px-6 phone:px-2 rounded-lg laptop:mt-0 tablet:mt-4 phone:mt-2 disabled:bg-slate-400'
                disabled={disable}
                onClick={() => processWords(listOfWords, inputType)}
            >
                Create deck
            </button>
        </div>
    )
}