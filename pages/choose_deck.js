import Header from '../components/Header'
import { useMemo, useState, useContext, createContext, useEffect } from 'react'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/*
Tạo deck collection rồi map giá trị cho từng thằng 
As soon as you click on one of them, its id or title will be queried in getserversideprops
*/

const CollectionContext = createContext()

const Card = ({ listOfWords = JSON.parse(listOfWords), id, title }) => {
    const [hover, setHover] = useState(false);

    return (
        <div className="list-none">
            <span
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                className=" bg-gray-200 transition-colors duration-300 relative hover:bg-gray-300 flex w-full h-full items-center justify-center text-3xl shadow-xl text-black"
            >
                <span className={`${hover && 'blur-sm'} absolute`}>{id}, {title}</span>
                {hover && <span className="absolute w-full inline-flex justify-evenly">
                    <FontAwesomeIcon
                        icon={faCheckCircle}
                        onClick={() => router.push({
                            pathname: '/editor',
                            query: {
                                words: listOfWords
                            }
                        })}
                        className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer" 
                    />
                </span>}
            </span>
        </div>
    );
};


export default function Collection({wordBuckets = JSON.parse(wordBuckets)}) {

    const [wordList, setWordList] = useState([])

    const memoizedValues = useMemo(() => {
        return { wordList, setWordList }
    }, [wordList, setWordList])

    return (
        <div className="container m-auto">
            <Header />
            <h1 className='text-4xl font-bold text-center py-12'>Your deck collection</h1>
            <div>
                <CollectionContext.Provider value={memoizedValues}>
                    <div className='
                    min-h-screen
                    desktop:grid desktop:grid-cols-3 desktop:gap-12 
                    laptop:grid laptop:grid-cols-3 laptop:gap-10
                    tablet:grid tablet:grid-cols-2 tablet:gap-10
                    phone:grid phone:grid-cols-1 phone:gap-8 
                    '>
                        {
                            Object.entries(wordBuckets).map(([cat, arr]) => <Card title={cat} listOfWords={JSON.stringify(arr)}/>)
                        }
                    </div>
                </CollectionContext.Provider>

            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    let { paragraph } = ctx.query

    let wordBuckets = await fetch(`./api/categorize_words?words=${String(paragraph)}`)

    return {
        props: { wordBuckets: JSON.stringify(wordBuckets) }
    }
}
