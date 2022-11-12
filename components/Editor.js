import DefaultErrorPage from "next/error";
import { useEffect, useRef, useState, useContext, createContext, useMemo, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { addDeck, updateDeck } from "../services/db";
import { useRouter } from "next/router";
config.autoAddCss = false; /* eslint-disable import/first */

const InfoContext = createContext()

const Card = ({ word, translation, starred, id }) => {
    const [flip, setFlip] = useState(false);

    return (
        <li key={id} id={id} className="h-full flex items-center justify-center object-cover">
            <span
                onClick={() => setFlip(!flip)}
                className={`px-6 py-4 bg-teal-300 flex items-center justify-center text-3xl shadow-xl text-white
                w-[calc(50%+4rem)] h-1/3 
                ${starred && "bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500"}
                `}
            >
                {flip ? word : translation}
            </span>
        </li>
    );
};

const Deck = () => {

    let flashPane = useRef(null)
    const { cardDecks, setWordpairs } = useContext(InfoContext)

    useEffect(() => {
        window.addEventListener('scroll', trackHeight)
        return () => window.removeEventListener('scroll', trackHeight)
    })

    const trackHeight = () => {
        if (flashPane) {
            flashPane.focus()
            let numCard = Math.round((flashPane.scrollTop / flashPane.clientHeight) + 1)

            let currentDeck = cardDecks.current[numCard - 1]
            setWordpairs({
                ...currentDeck
            })
        }
        else;
    }

    return <div id="flashpane" ref={el => {
        if (el) flashPane = el
    }} onScroll={trackHeight} className="overflow-scroll flex flex-col
    desktop:w-3/5 laptop:w-3/5 tablet:w-[100%] phone:w-[100%]
    desktop:h-[100%] laptop:h-[100%] tablet:h-3/5 phone:h-3/5 scrollbar-hide">
        <ul id="cardlist" className="h-full">
            {cardDecks.current.map((content, i) => (
                <Card {...content} key={i + content.id}/>
            ))}
        </ul>
    </div >
}

const EditField = ({ word, title, number }) => {

    const initState = {
        hover: false,
        clicked: false
    }

    const { wordPairs, setWordpairs, cardDecks, deckTitle } = useContext(InfoContext)

    // write your own hook which tracks if the element is both hovered & disabled.
    const [mouse, setMouse] = useState(initState)

    let hoverFunc = () => setMouse({
        clicked: false,
        hover: true
    })

    let clickFunc = () => {
        window.removeEventListener('mouseover', hoverFunc)
        setMouse({
            hover: false,
            clicked: true
        })
    }

    useEffect(() => {
        window.addEventListener('click', clickFunc)
        return () => window.removeEventListener('click', clickFunc)
    })

    let saveResults = (e) => {
            setMouse(initState)
            let currentDeck = cardDecks.current[wordPairs.id - 1]
            let parentId = e.target.parentElement.parentElement.id
            currentDeck[parentId] = e.target.value
            setWordpairs({
                ...wordPairs,
                [parentId]: currentDeck[parentId]
            })
    }

    return (
        <span className="relative flex justify-end">
            {/* {mouse.hover && } */}
            {number !== undefined
                ? <input
                    disabled={!mouse.clicked}
                    type="number"
                    min={1}
                    max={cardDecks.current.length}
                    onMouseOver={hoverFunc}
                    onMouseLeave={() => setMouse(initState)}
                    onClick={clickFunc}
                    onKeyDown={e => {
                        if ([13, 9].includes(e.keyCode)) {
                            let numCard = e.target.value
                            setMouse(initState)
                            setWordpairs({
                                ...cardDecks.current[numCard - 1]
                            })
                            document.getElementById("cardlist").childNodes[numCard - 1].scrollIntoView()
                            setMouse(initState)
                        }
                    }}
                    defaultValue={number}
                    key={number} // https://thewebdev.info/2022/05/12/how-to-fix-react-input-defaultvalue-doesnt-update-with-state-with-javascript/
                    className="bg-transparent w-fit text-center"
                />
                : (word !== undefined
                    ? <input
                        disabled={!mouse.clicked}
                        onMouseOver={hoverFunc}
                        onMouseLeave={() => setMouse(initState)}
                        onClick={clickFunc}
                        onKeyDown={e => {
                            if ([13, 9].includes(e.keyCode)) {
                                saveResults(e)
                                setMouse(initState)
                            }
                            else return;
                        }}
                        defaultValue={word}
                        key={word}
                        placeholder={word}
                        className="bg-transparent text-right w-full" />
                    : <input
                        disabled={!mouse.clicked}
                        onMouseOver={hoverFunc}
                        onMouseLeave={() => setMouse(initState)}
                        onClick={clickFunc}
                        onKeyDown={e => {
                            if ([13, 9].includes(e.keyCode)) {
                                deckTitle.current = e.target.value
                                setMouse(initState)
                            }
                            else return;
                        }}
                        defaultValue={title}
                        key={title}
                        placeholder={title}
                        className="bg-transparent py-2 px-1 text-center w-fit unexpected_underline" />
                )
            }
        </span>
    )
}

const SearchBar = () => {

    const { cardDecks, setWordpairs } = useContext(InfoContext)

    const [suggestion, setSuggestion] = useState([])

    const getKeyWords = (e) => {
        let keyword = e.target.value
        keyword.length >= 2
            ? setSuggestion(cardDecks.current.filter(({ word, translation }) => {
                return word.includes(keyword.toLowerCase()) || translation.includes(keyword.toLowerCase())
            }))
            : setSuggestion([])
    }

    return (
        <div className="w-[90%] m-3 flex relative">
            <input
                className="w-full text-2xl self-center rounded bg-white px-4 py-2 mx-auto"
                placeholder="Type any word here"
                onChange={getKeyWords}
            />
            {
                !!suggestion.length
                && <ul className='px-4 py-2 mx-auto text-left w-full mt-12 absolute bg-white'>
                    {
                        suggestion.map((wordObj, i) =>
                            <li
                                className="font-bold cursor-pointer list-none text-md"
                                onClick={() => {
                                    let chosenDeck = cardDecks.current[wordObj.id - 1]
                                    setWordpairs({
                                        ...chosenDeck
                                    })
                                    setSuggestion([])
                                    document.getElementById("cardlist").childNodes[wordObj.id - 1].scrollIntoView()
                                }}
                                key={i + wordObj.id}
                            >
                                <span>{wordObj.word} - {wordObj.translation}</span>
                            </li>
                        )
                    }
                </ul>
            }
        </div>
    )
}


// if star - set card to bright red/yellow gradient 
export default function Editor({title, listOfCards, id, isNew = true}) {

    const deckTitle = useRef(title)
    const cardDecks = useRef(JSON.parse(listOfCards));
    const router = useRouter()

    const [wordPairs, setWordpairs] = useState({
        ...cardDecks.current[0]
    })

    const memoizedValues = useMemo(() => {
        return { wordPairs, cardDecks, deckTitle, setWordpairs }
    }, [wordPairs, setWordpairs])

    return cardDecks.current.length > 15    
        ? <DefaultErrorPage statusCode={403} title="There should be less than 15 words" />
        : <div className="flex h-screen 
        desktop:flex-row laptop:flex-row tablet:flex-col-reverse phone:flex-col-reverse">
            <InfoContext.Provider value={memoizedValues}>
                <div style={{ backgroundColor: 'rgb(247,241,233)' }}
                    className="sticky flex flex-col items-center
                    desktop:w-2/5 laptop:w-2/5 tablet:w-full phone:w-full
                    desktop:h-full laptop:h-full tablet:h-1/2 phone:h-1/2 
                    desktop:overscroll-none laptop:overscroll-none tablet:overflow-scroll phone:overflow-scroll scrollbar-hide">
                    <SearchBar />
                    <span className="m-auto inline-flex 
                    desktop:text-4xl laptop:text-4xl tablet:text-2xl phone:text-xl 
                    desktop:my-auto laptop:my-auto tablet:my-3 phone:my-3
                    "><EditField title={deckTitle.current} /></span>
                    <div className="w-full container flex flex-col">
                        <div className="desktop:w-[90%] laptop:w-[90%] tablet:w-full phone:w-full desktop:text-2xl laptop:text-2xl tablet:text-xl phone:text-lg inline-flex justify-between rounded bg-white px-6 py-4 mb-3 mx-auto" id="word">
                            <p>Word</p>
                            <EditField word={wordPairs.word} />
                        </div>
                        <div className="desktop:w-[90%] laptop:w-[90%] tablet:w-full phone:w-full desktop:text-2xl laptop:text-2xl tablet:text-xl phone:text-lg inline-flex justify-between rounded bg-white px-6 py-4 mx-auto" id="translation">
                            <p>Translation</p>
                            <EditField word={wordPairs.translation} />
                        </div>
                    </div>
                    <div className="flex flex-row w-[90%] desktop:my-auto laptop:my-auto tablet:my-3 phone:my-3 desktop:text-3xl laptop:text-3xl tablet:text-xl phone:text-lg justify-around mx-auto">
                        <button onClick={() => {
                            let numCard = wordPairs.id
                            let currentCardDeck = cardDecks.current
                            currentCardDeck.splice(numCard - 1, 1)
                            currentCardDeck.map((card, index) => card.id = index + 1)

                            let cardList = document.getElementById("cardlist")
                            cardList.childNodes[numCard - 1].scrollIntoView()
                            setWordpairs({
                                ...cardDecks.current[numCard - 1]
                            })
                        }}>
                            <FontAwesomeIcon icon={faTrash} className="cursor-pointer" />
                        </button>
                        <button
                            onClick={() => {
                                let currentCardDeck = cardDecks.current
                                let initState = {
                                    id: currentCardDeck.length + 1, word: '', translation: '', starred: false
                                }
                                setWordpairs(initState)
                                currentCardDeck.push(initState)
                                setTimeout(() => {
                                    let cardList = document.getElementById("cardlist")
                                    cardList.lastElementChild.scrollIntoView()
                                }, 1)
                            }}
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="cursor-pointer hover:text-blue-400"
                            />
                        </button>
                        <button onClick={() => {
                            let currentCardDeck = cardDecks.current
                            let is_starred = currentCardDeck[wordPairs.id - 1].starred
                            currentCardDeck[wordPairs.id - 1].starred = !is_starred
                            setWordpairs({
                                ...currentCardDeck[wordPairs.id - 1]
                            })
                        }}>
                            <FontAwesomeIcon icon={faStar} className="cursor-pointer"
                                color={wordPairs.starred ? 'yellow' : undefined}
                            />
                        </button>
                    </div>
                    <span className="desktop:my-0 laptop:my-0 tablet:my-3 phone:my-3 desktop:text-2xl laptop:text-2xl tablet:text-xl phone:text-lg"><EditField number={wordPairs.id} /> out of  {cardDecks.current.length}</span>
                    <button 
                    onClick={async () => {
                        isNew ? await addDeck(cardDecks.current, deckTitle.current) : await updateDeck(id, deckTitle.current, cardDecks.current) 
                        router.push('/collection')
                    }} 
                    className="my-auto text-center w-[90%] desktop:text-2xl laptop:text-2xl tablet:text-xl phone:text-lg desktop:p-2 laptop:p-2 tablet:p-1 phone:p-0.5 border rounded border-black hover:bg-black hover:text-white create_deck_bg">
                      {isNew ? "Create deck" : "Update deck"}  
                    </button>
                </div>
                <Deck />
            </InfoContext.Provider>
        </div>;
}

