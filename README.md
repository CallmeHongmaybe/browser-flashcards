# About 

Lingohelper is an automatic flashcard generator for language learners, designed to live right in your browser. You can input a short paragraph or a comma-separated list of words, and the app will take you to a flashcard editor where you can make edits before saving to your browser storage. The project was born out of a desire to provide an efficient vocabulary learning tool that doesn't require a subscription or registration.

No signup required, no ads, no cookies, no paywall, just flashcards. For your own benefit. 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0z65dmer69lfo6r5o1cz.jpg)

## Features 
- Automatic flashcard generation from user-input text
- Intuitive flashcard editor for customizing decks
- Browser-based, offline usage
- Privacy-focused, no registration required

## Usage

1. **Create your flashcard deck:** Enter a list of new words or a paragraph.
2. **Edit your deck:** Press the 'Create Deck' button to be taken to the editor where you can customize your new deck.
3. **Save changes:** If you make any changes, press `Enter` to ensure they are saved.

For a visual guide, check out the following video tutorials:
- [Video Tutorial 1](https://youtu.be/LlbAFDLhAZ4)
- [Video Tutorial 2](https://youtu.be/1Q_Q1tLpmtc)

Please note that the project is still in its MVP stage and the translations shown in the videos may not be correct.

## Tech Stack 
- JAM Stack
- TailwindCSS
- Dexie.js (A React wrapper for IndexedDB)

## Installation instructions  

This is a [Next.js](https://nextjs.org/) v12 project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Package managers for this project would ideally be `npm` or `pnpm`.

First, run: 
```bash
npm install  
```

Then for running dev or build environments you can do:
```bash
npm run dev 
# or 
pnpm run dev   
```

Or you can run its build instead: 
```bash
npm run build 
# then 
npm run start   
```
## Contributing

Your contributions are always welcome! Here are a couple of areas where help would be appreciated:

- Finding a better solution for the translation API
- Implementing a flipping animation when editing or starring a card
- Enabling download of Anki flashcards from saved decks

If you have any suggestions or questions, feel free to open an issue or make a pull request.


