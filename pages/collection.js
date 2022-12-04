import Header from '../components/Header'
import Image from 'next/image'
import { useMemo, useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { deleteDeck, getAllDecks } from '../services/db'
import { faDownload, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { convertDataToCSVFile } from '../services/download_csv'

/*
Tạo deck collection rồi map giá trị cho từng thằng
As soon as you click on one of them, its id or title will be queried in getserversideprops
*/

const CollectionContext = createContext()

const Card = ({ id, title }) => {
    const [hover, setHover] = useState(false);
    const { collections, setCollections } = useContext(CollectionContext)
    const router = useRouter()

    return (
        <div className="list-none" key={title}>
            <span
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                className="bg-gray-200 transition-colors duration-300 relative hover:bg-gray-300 flex w-full h-full items-center justify-center text-3xl shadow-xl text-black"
            >
                <span className={`${hover && 'blur-sm'} absolute`}>{id}, {title}</span>
                {hover && <span className="absolute w-full inline-flex justify-evenly">
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer"
                        onClick={(ev) => {
                            deleteDeck(id)
                            setCollections(
                                collections
                                .splice(collections
                                    .findIndex(item => item.id === id),
                                    1)
                            )
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => router.push({
                            pathname: '/deck',
                            query: { id },
                        })}
                        className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer"
                    />
                    <FontAwesomeIcon
                        icon={faDownload}
                        onClick={async () => {
                            var anchor = document.createElement('a');
                            anchor.setAttribute('download', 'mydata.csv');
                            var url = URL.createObjectURL(await convertDataToCSVFile(id));
                            anchor.setAttribute('href', url);
                            anchor.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="desktop:text-3xl laptop:text-2xl tablet:text-xl phone:text-xl cursor-pointer"
                    />
                </span>}
            </span>
        </div>
    );
};


export default function Collection() {

    const [collections, setCollections] = useState([])

    useEffect(() => {
        (async () => {
            const decks = await getAllDecks()
            setCollections(decks)
        })()
    })

    const memoizedValues = useMemo(() => {
        return { collections, setCollections }
    }, [collections, setCollections])

    return !!collections.length && (
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
                            collections.map((deck) => <Card {...deck} key={deck.title}/>)
                        }
                    </div>
                </CollectionContext.Provider>

            </div>
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
