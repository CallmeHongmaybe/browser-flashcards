import Editor from "../../components/Editor";

const listOfCards = [
    {
        id: 1,
        word: "drama",
        translation: "chính kịch",
        starred: false
    },
    {
        id: 2,
        word: "wasaho",
        translation: "mẹ",
        starred: false
    },
    {
        id: 3,
        word: "bitch",
        translation: "chó cái",
        starred: false
    },
    {
        id: 4,
        word: "slimy",
        translation: "nhếch nhác",
        starred: false
    },
    {
        id: 5,
        word: "fistful",
        translation: "một nắm tay",
        starred: false
    },
    {
        id: 6,
        word: "resentful",
        translation: "hờn dỗi",
        starred: false
    },
    {
        id: 7,
        word: "growl",
        translation: "gầm gừ",
        starred: false
    },
    {
        id: 8,
        word: "rice hub",
        translation: "cơm hộp",
        starred: false
    },
    {
        id: 9,
        word: "resentful",
        translation: "hờn dỗi",
        starred: false
    },
    {
        id: 10,
        word: "Malaysia",
        translation: "Mã Lai",
        starred: false
    },
    {
        id: 11,
        word: "pain in the ass",
        translation: "đau đít",
        starred: false
    }
]

export default function IndexEditor() { 
    return <Editor listOfCards={JSON.stringify(listOfCards)} title="Wasaho deck."/>
}

