import { getApp, getApps, initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAZTKSRie_8_aCY2IHTpmJlFflk8bf6SYo',
  authDomain: 'ashtools.firebaseapp.com',
  projectId: 'ashtools',
  storageBucket: 'ashtools.firebasestorage.app',
  messagingSenderId: '97733145470',
  appId: '1:97733145470:web:1145fbe52a5085a6b1b92f',
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
