import Editor from "../../components/Editor";

export default function NewEditor({cardDecks}) { 
    return <Editor listOfCards={cardDecks} title="New deck." isNew={true}/>
}

export async function getServerSideProps(ctx) {
    const { Translate } = require('@google-cloud/translate').v2;

    var { words } = ctx.query;

    const translate = new Translate({
        keyFilename: 'lingo-flash-cred.json'
    });

    let [translations] = await translate.translate(words, 'vi');
    translations = Array.isArray(translations) ? translations : [translations];
    translations = JSON.parse(translations)

    let cardDecks = JSON.parse(words).map((word, i) => {
        return {
            id: i + 1,
            word,
            translation: translations[i],
            starred: false
        }
    });

    return {
        props: {
            cardDecks: JSON.stringify(cardDecks)
        }
    }
}



// formula: Math.round((flashpane.scrollTop / flashpane.clientHeight) + 1 ) 


