import Dexie from 'dexie';

const db = new Dexie('lingo-helper-db');

db.version(1).stores({
   decks: '++id, title'
});

export const addDeck = async (data, title) => {
   // useCallback to add the loading page instead of using useState
   try {
       // Add the new friend!
       await db.open() 
       return await db.decks.add({
           title, 
           data
       })
   } catch (error) {
       console.log(error);
   }
}

export const deleteDeck = async (id) => {
    try {
        await db.open() 
        return await db.decks.delete(id)
    } catch (error) {
        console.log(error);
    }
 }

export const getAllDecks = async () => {
   try {
       await db.open() 
       return await db.decks.toArray(arr => arr.map(el => ({
           id: el.id, 
           title: el.title
       })))
   } catch (error) {
       console.log(error);
   }
}

export const getDeck = async (id) => {
    try {
        await db.open() 
        return await db.decks.get(Number.parseInt(id))
    } catch (error) {
        console.log(error);
    }
 }

 export const updateDeck = async (id, newTitle, changes) => {
    try {
        await db.open() 
        return await db.decks.where("id").equals(Number.parseInt(id)).modify({
            title: newTitle, 
            data: changes 
        })
    } catch (error) {
        console.log(error);
    }
 }

export default db 