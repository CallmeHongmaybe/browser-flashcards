import Header from '../components/Header'
import { useMemo, useState, useContext, createContext, useRef } from 'react'
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import natural from 'natural'
import tag_names from '../lib/tag_names'
import { useRouter } from 'next/router'
import Tooltip from '../components/Tooltip'
/*
Tạo deck collection rồi map giá trị cho từng thằng
*/

const SelectListContext = createContext()

const Card = ({ listOfWords, title, key }) => {
    const [hover, setHover] = useState(false);
    const [clicked, setClicked] = useState(false) // adding blue highlight border to card
    const { wordList } = useContext(SelectListContext)

    return (
        <button
            key={key}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            className={`bg-gray-200 transition-colors duration-300 px-6 py-4 relative hover:bg-gray-300 flex w-auto items-center justify-center text-2xl shadow-xl text-black ${clicked && 'border-4 border-indigo-600'}`}
        >
            <p className={`${hover && 'blur-sm'}`}>{title}</p>
            {hover && <span className="absolute flex justify-evenly">
                <FontAwesomeIcon
                    icon={clicked ? faXmarkCircle : faCheckCircle}
                    onClick={() => {
                        if (clicked == false) {
                            wordList.current = wordList.current.concat(listOfWords)
                            setClicked(true)
                        }
                        else {
                            wordList.current = wordList.current.filter(word => !listOfWords.includes(word))
                            setClicked(false)
                        }
                        console.log('wordList.current =', wordList.current)
                    }}
                    className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer"
                />
            </span>}
            { }
        </button>
    );
};

export default function Collection({ wordBuckets }) {

    let wordList = useRef([])

    const memoizedValues = useMemo(() => {
        return { wordList }
    }, [wordList])

    const router = useRouter()

    const translateWords = (e) => {
        // this block of code goes to the new page
        router.push({
            pathname: '/editor',
            // hash the list of words here first 
            query: { words: JSON.stringify(wordList.current) },
        })
    }

    return (
        <div className="container m-auto">
            <Header />
            <h1 className='text-4xl font-bold text-center py-12'>Your deck collection</h1>
            <div>
                <SelectListContext.Provider value={memoizedValues}>
                    <div
                        className='min-h-screen flex flex-wrap'
                    >
                        {
                            (() => {
                                /**
                                 * tempArrCollections = [[<Card/>], [<Card/>,<Card/>], [<Card/>,<Card/>,<Card/>], ...] 
                                 * tempWordArr = [cat, arr]
                                 */
                                let tempArrCollections = []
                                let tempWordArr = Object.entries(JSON.parse(wordBuckets))

                                for (
                                    let i = 1;
                                    tempWordArr.length >= i;
                                    i++
                                ) {
                                    tempArrCollections.push(tempWordArr.slice(0, i))
                                    tempWordArr = tempWordArr.slice(i)
                                }

                                tempArrCollections = tempArrCollections.concat(tempWordArr)

                                return tempArrCollections.map((card, cardIndex) => (
                                    <div className="w-full flex items-center justify-evenly" key={cardIndex + new Date().getTime()}>
                                        {card.map(([cat, arr], indx) => {                
                                            return arr && !cat.includes("undefined") && (
                                                <Tooltip title={arr.toString()}>
                                                    <Card title={cat} listOfWords={arr} key={cat + indx} />
                                                </Tooltip>
                                            )
                                        })}</div>
                                ))
                            })()
                        }
                    </div>
                </SelectListContext.Provider>
            </div>

            <button
                className='bg-slate-900 flex items-center justify-center my-6 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 laptop:px-6 phone:px-2 rounded-lg m-auto'
                onClick={e => translateWords(e)}
            >
                <span>Create deck</span>
            </button>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    let { paragraph } = ctx.query

    const language = "EN";
    const defaultCategory = 'N';
    const defaultCategoryCapitalized = 'NNP';

    var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
    var ruleSet = new natural.RuleSet(language);
    var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

    const filterDuplicates = (arr) => {
        return arr.filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
        })
    }

    const sortByTags = (arr) => {
        let obj = {}
        // tag names is now a hash table - lookup time: O(1)
        filterDuplicates(arr.map(word => word.tag)).forEach(tag => {
            obj[tag_names[tag]] = arr.filter(item => item.tag == tag).map(word => word.token)
        })

        return obj
    }

    var tokenizer = new natural.WordTokenizer();

    let corpus = filterDuplicates(tokenizer.tokenize(paragraph))
    // let sentences = paragraph.split(/[,.]+\s+/g)
    let wordBuckets = sortByTags(tagger.tag(corpus).taggedWords)

    return {
        props: { wordBuckets: JSON.stringify(wordBuckets) }
    }
}
