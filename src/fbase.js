import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Authorization
export const authService = getAuth(app);

// Database
export const databaseService = getFirestore(app);
export const userCollection = collection(databaseService, 'users');
export const postCollection = collection(databaseService, 'posts');

// Storage
export const storageService = getStorage(app);
export const DEFAULT_PROFILE_PIC_URL =
	'https://firebasestorage.googleapis.com/v0/b/instagram-clone-dcbd6.appspot.com/o/images%2Fdefault-profile-pic.jpg?alt=media&token=fa16ab95-2b26-43f4-9bea-c410bdac6623';
