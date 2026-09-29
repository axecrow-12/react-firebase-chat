# AGROVIA Chat App

A realtime chat app built with React, Vite and Firebase, following the Lama Dev React Firebase chat tutorial.

## Status

Accounts work, and you can find other users and start a chat with them. Sending messages is not built yet.

What works today:

1. Sign up, sign in and logout with Firebase Authentication
2. User profiles saved in Firestore and profile pictures in Cloud Storage
3. Your name and picture shown at the top of the chat list
4. Finding people by username with the + button and starting a chat with them
5. Your chat list, updated live and filterable with the search box
6. Opening a chat shows the other person in the middle and right panels
7. Emoji picker in the message box

Still to do:

1. Sending and showing messages
2. Sending images
3. Block user
4. Real shared photos in the right panel

## Running locally

You need Node.js 20.19 or newer.

```bash
npm install
npm run dev
```

The app needs a Firebase project (or the local emulators, see below) before it will show the login screen.

Other scripts:

1. `npm run build` creates a production build in `dist`
2. `npm run preview` serves that build locally
3. `npm run lint` checks the code with ESLint

## Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. Add a Web app to it (Project settings, General, Your apps) and keep the config values it shows.
3. Turn on Authentication with the Email/Password sign in method.
4. Create a Firestore database.
5. Turn on Cloud Storage. New projects need the Blaze (pay as you go) plan for this. Without it, everything except profile pictures still works.
6. Copy `.env.example` to `.env.local` and fill in the config values.
7. Publish the security rules: paste `firestore.rules` into Firestore, Rules and `storage.rules` into Storage, Rules in the console (or run `npx firebase-tools deploy --only firestore:rules,storage`).
8. Restart `npm run dev`.

`.env.local` is ignored by git, so your config stays on your machine.

## Local emulators

You can run the app without a Firebase project by using the Firebase emulators. They need Java 11 or newer.

1. In one terminal: `npx firebase-tools emulators:start --project demo-agrovia`
2. In `.env.local`, set `VITE_USE_FIREBASE_EMULATORS=true`
3. In another terminal: `npm run dev`

Emulator data is wiped when the emulators stop.

## Data

1. `users/{uid}`: profile with `id`, `username`, `usernameLower` (for search), `avatar` (image URL, empty for the default picture) and `blocked` (list of user ids)
2. `chats/{chatId}`: a chat between two people, with `members` (their two user ids) and `createdAt`. The chat id is the two user ids sorted and joined with `_`, so two people always share one chat.
3. `userchats/{uid}/chats/{chatId}`: one entry per chat in a user's chat list, with `chatId`, `receiverId` (the other person), `lastMessage`, `updatedAt` and `isSeen`
4. Storage `avatars/{uid}/...`: profile pictures

The security rules only let chat members read a chat, and only let someone add a chat to another person's list if they are both members of it.

## Project layout

```
src/
  App.jsx                 signed in check and page layout
  lib/
    firebase.js           Firebase setup (reads .env.local)
    upload.js             uploads a file to Cloud Storage
    userStore.js          the signed in user's profile
    chatStore.js          the chat that is open
    chats.js              starting a chat between two users
  components/
    login/                sign in and sign up screen
    notification/         toast messages
    list/                 left panel: your profile, chat list and the add user popup
    chat/                 middle panel: messages and message box
    detail/               right panel: contact details and shared files
public/                   icons and background image
firestore.rules           Firestore security rules
storage.rules             Cloud Storage security rules
firebase.json             rules and emulator settings for the Firebase CLI
```
