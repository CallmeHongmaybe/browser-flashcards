import { useEffect, useState } from "react";
import Editor from "../components/Editor";
import { getDeck } from "../services/db";

// and allow user to put new updates to the deck_id (saveDeck)
// you can pass addDeck or saveDeck as a function parameter to editor: e.g. dbaction={saveDeck}

export default function DeckEditor({ id }) {

    const [deckData, setDeckData] = useState()

    useEffect(() => {
        (async () => {
            let { data, title } = await getDeck(id)
            setDeckData({
                data, id, title
            })
        })()
    })

    return deckData && <Editor title={deckData.title} listOfCards={JSON.stringify(deckData.data)} id={deckData.id} isNew={false} />
}

export async function getServerSideProps(ctx) {
    let { id } = ctx.query

    return {
        props: { id }
    }
}


