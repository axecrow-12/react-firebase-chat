# AGROVIA Chat App

A realtime chat app built with React and Vite, following the Lama Dev React Firebase chat tutorial.

## Status

The interface is built with placeholder content. Firebase (login, database and file storage) is not connected yet, so messages, users and buttons are not live.

What works today:

1. Three panel layout: chat list, conversation and user details
2. Emoji picker in the message box

Still to do:

1. Login and signup screens
2. Firebase setup and email/password login
3. Users and chats stored in Firestore, plus adding users
4. Sending messages and uploading images
5. Block user and logout

## Running locally

You need Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

Other scripts:

1. `npm run build` creates a production build in `dist`
2. `npm run preview` serves that build locally
3. `npm run lint` checks the code with ESLint

## Project layout

```
src/
  App.jsx                 page layout
  components/
    list/                 left panel: your profile and chat list
    chat/                 middle panel: messages and message box
    detail/               right panel: contact details and shared files
public/                   icons and background image
```
