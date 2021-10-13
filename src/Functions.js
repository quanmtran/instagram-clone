import { doc, getDoc } from 'firebase/firestore';
import { userCollection } from 'fbase';

export const getUsername = async (userId) => {
	const docSnap = await getDoc(doc(userCollection, userId));
	return docSnap.data().username;
};
