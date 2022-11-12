import natural from 'natural'
import tag_names from "../../lib/tag_names"

export default (req, res) => {
    const {
        query: { paragraph } // expects paragraph to be a string 
    } = req 

    try {
        const language = "EN"
        const defaultCategory = 'N';
        const defaultCategoryCapitalized = 'NNP';

        var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
        var ruleSet = new natural.RuleSet('EN');
        var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

        var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);
        // var paragraph = "Holding a fist full of green beans, the male gorilla stares through the iron bars and glass of her home at the visitors busy taking pictures of Bangkok’s controversial “shopping mall gorilla”. To their dismay, the animal fondly known as King Kong soon saunters away from the viewing window, past the hanging tyre to the back of her sparse enclosure. Elsewhere around the zoo, an orangutan looks on at maintenance work, which has the concrete corridor partially cordoned off, while rusty signs and flaking walls make up the aesthetic of this ageing zoo. Flamingos roam free and monkeys reach out for food that visitors can buy on arrival.";

        const filterDuplicates = (arr) => { 
            return arr.filter(function(item, pos, self) {
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
        let objectWords = sortByTags(tagger.tag(corpus).taggedWords)

        // from here you can pair different tags as collocations
        // ask stack overflow the different combinations of tags into a full sentence. 
        res.status(200).json(objectWords)
        res.end()
    }
    catch (ex) {
        res.status(500).send(new Error("Got an error. " + ex))
    }

}