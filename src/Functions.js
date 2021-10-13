import { doc, getDoc } from 'firebase/firestore';
import { userCollection } from 'fbase';

export const getUsername = async (userId) => {
	const docSnap = await getDoc(doc(userCollection, userId));
	return docSnap.data().username;
};

export const getTimeAgo = (postedAt) => {
	const SECONDS_MULTIPLIER = 1000;
	const MINUTES_MULTIPLIER = SECONDS_MULTIPLIER * 60;
	const HOURS_MULTIPLIER = MINUTES_MULTIPLIER * 60;
	const DAYS_MULTIPLIER = HOURS_MULTIPLIER * 24;

	const alphaTime = Date.now() - postedAt;
	let timeDigit;
	let timeUnit;
	if (alphaTime / DAYS_MULTIPLIER >= 1) {
		timeDigit = `${Math.floor(alphaTime / DAYS_MULTIPLIER)}`;
		timeUnit = 'DAY';
	} else if (alphaTime / HOURS_MULTIPLIER >= 1) {
		timeDigit = `${Math.floor(alphaTime / HOURS_MULTIPLIER)}`;
		timeUnit = 'HOUR';
	} else if (alphaTime / MINUTES_MULTIPLIER >= 1) {
		timeDigit = `${Math.floor(alphaTime / MINUTES_MULTIPLIER)}`;
		timeUnit = 'MINUTE';
	} else {
		timeDigit = `${Math.floor(alphaTime / SECONDS_MULTIPLIER)}`;
		timeUnit = 'SECOND';
	}

	return `${timeDigit} ${timeUnit}${timeDigit > 1 ? 'S' : ''} AGO`;
};
