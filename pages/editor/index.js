import Editor from "../../components/Editor";
import japanese_words from "../../lib/japanese_words";

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

    let LIST_WORD_LENGTH = japanese_words.length
    let cardDecks = JSON.parse(words).map((word, i) => {
        // shout out to Random Word API -  https://random-word-api.herokuapp.com
        const res = japanese_words.find(translation => translation.mean === word) || japanese_words[Math.floor(Math.random() * LIST_WORD_LENGTH)] 

        return {
            id: i + 1,
            word,
            translation: res.jp.wd,
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


