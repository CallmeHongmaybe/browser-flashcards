import Editor from "../../components/Editor";

export default function NewEditor({cardDecks}) { 
    return <Editor listOfCards={cardDecks} title="New deck." isNew={true}/>
}

export async function getServerSideProps(ctx) {
    // const { Translate } = require('@google-cloud/translate').v2;

    var { words } = ctx.query;

    // const translate = new Translate({
    //     keyFilename: 'lingo-flash-cred.json'
    // });

    // let [translations] = await translate.translate(words, 'zh');
    // translations = Array.isArray(translations) ? translations : [translations];
    // translations = JSON.parse(translations)
    let cardDecks = JSON.parse(words).map(async (word, i) => {
        // shout out to Random Word API -  https://random-word-api.herokuapp.com 
        const res = await fetch("https://random-word-api.herokuapp.com/word?lang=zh")
        const data = await res.json()

        return {
            id: i + 1,
            word,
            translation: data[0],
            starred: false
        }
    });

    return {
        props: {
            cardDecks: JSON.stringify(await Promise.all(cardDecks))
        }
    }
}

// formula: Math.round((flashpane.scrollTop / flashpane.clientHeight) + 1 ) 


