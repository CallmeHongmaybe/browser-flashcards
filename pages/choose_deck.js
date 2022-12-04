import Header from '../components/Header'
import { useMemo, useState, useContext, createContext, useRef } from 'react'
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import natural from 'natural'
import tag_names from '../lib/tag_names'

/*
Tạo deck collection rồi map giá trị cho từng thằng
As soon as you click on one of them, its id or title will be queried in getserversideprops
*/

const SelectListContext = createContext()

const Card = ({ listOfWords, title }) => {
    const [hover, setHover] = useState(false);
    const [clicked, setClicked] = useState(false) // adding blue highlight border to card
    const { wordList } = useContext(SelectListContext)

    return (
        <div className="list-none" key={title}>
            <span
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                className={`bg-gray-200 transition-colors duration-300 relative hover:bg-gray-300 flex w-full h-full items-center justify-center text-3xl shadow-xl text-black ${clicked && 'border-4 border-indigo-600'}`}
            >
                <p className={`${hover && 'blur-sm'} absolute`}>{title}</p>
                {hover && <span className="absolute w-full inline-flex justify-evenly">
                    <FontAwesomeIcon
                        icon={clicked ? faXmarkCircle : faCheckCircle}
                        onClick={() => {
                            if (clicked == false) {
                                wordList.current = [...wordList.current, ...listOfWords]
                                setClicked(true)
                            }
                            else {
                                let wordSet = new Set(wordList.current)
                                listOfWords.forEach(word => wordSet.delete(word))
                                wordList.current = Array.from(wordSet)
                                setClicked(false)
                            }
                        }}
                        className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer"
                    />
                </span>}
            </span>
        </div>
    );
};


export default function Collection({ wordBuckets }) {

    let wordList = useRef([])

    const memoizedValues = useMemo(() => {
        return { wordList }
    }, [wordList])

    // for i = 0, n = 2i + 1 while wordList.length - n > 0 => Cards

    return (
        <div className="container m-auto">
            <Header />
            <h1 className='text-4xl font-bold text-center py-12'>Your deck collection</h1>
            <div>
                <SelectListContext.Provider value={memoizedValues}>
                    <div
                    className='min-h-screen flex flex-row-reverse flex-wrap'
                    >
                        {
                            // Everything Changed When the Fire Nation Attacked is a memorable quote from the animated TV series Avatar: The Last Airbender.
                            // Paste this in node: let tempWordArr = [[1,3],[5,7],[4,8],[7,8,12],[12,678,16]]
                            (() => {
                                let tempArrCollections = [] // [[<Card/>], [<Card/>,<Card/>], [<Card/>,<Card/>,<Card/>], ...]
                                // tempWordArr = [cat, arr]
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

                                // console.log(tempArrCollections)

                                return tempArrCollections.map((card) => (
                                    <div className='w-full flex justify-evenly'>{card.map(([cat, arr]) => <Card title={cat} listOfWords={arr}/>)}</div>
                                ))
                            })()
                        }
                    </div>
                </SelectListContext.Provider>
            </div>
        </div>
    )
}

export async function getServerSideProps(ctx) {
    let { paragraph } = ctx.query

    const language = "EN"
    const defaultCategory = 'N';
    const defaultCategoryCapitalized = 'NNP';

    var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
    var ruleSet = new natural.RuleSet('EN');
    var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

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
