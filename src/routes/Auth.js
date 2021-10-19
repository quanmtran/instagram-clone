import React, { useState } from 'react';
import { authService, userCollection, DEFAULT_PROFILE_PIC_URL } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL } from 'firebase/storage';
import { Redirect } from 'react-router-dom';

export default function Auth({ isLoggedIn }) {
	// States
	const [isLoginState, setIsLoginState] = useState(true);
	const [emailInput, setEmailInput] = useState('');
	const [passwordInput, setPasswordInput] = useState('');
	const [usernameInput, setUsernameInput] = useState('');
	const [fullnameInput, setFullnameInput] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const newAccountToggle = () => {
		setIsLoginState((prev) => !prev);
		setEmailInput('');
		setPasswordInput('');
		setUsernameInput('');
		setFullnameInput('');
		setErrorMessage('');
	};

	const handleInputChange = (e) => {
		const {
			target: { name, value },
		} = e;

		setErrorMessage('');

		switch (name) {
			case 'email':
				setEmailInput(value);
				break;
			case 'password':
				setPasswordInput(value);
				break;
			case 'fullname':
				setFullnameInput(value);
				break;
			case 'username':
				setUsernameInput(value);
				break;
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (isLoginState) {
				await signInWithEmailAndPassword(authService, emailInput, passwordInput);
			} else {
				const userCredential = await createUserWithEmailAndPassword(authService, emailInput, passwordInput);

				const userId = userCredential.user.uid;
				const userObject = {
					userId: userId,
					username: usernameInput,
					profilePictureUrl: DEFAULT_PROFILE_PIC_URL,
					name: fullnameInput,
					bio: '',
					followers: [],
					followings: [],
				};

				await setDoc(doc(userCollection, userId), userObject);
			}
		} catch (error) {
			setErrorMessage(error.message);
		}
	};

	return isLoggedIn ? (
		<Redirect to="/home" />
	) : (
		<div className="auth-page">
			<form onSubmit={handleSubmit}>
				<div className="insta-logo">Isn'tagram</div>
				<div>
					<input name="email" type="text" value={emailInput} placeholder="Email" onChange={handleInputChange} required />
				</div>
				<div>
					<input name="password" type="password" value={passwordInput} placeholder="Password" onChange={handleInputChange} required />
				</div>
				{!isLoginState && (
					<>
						<div>
							<input name="fullname" type="text" value={fullnameInput} placeholder="Full Name" onChange={handleInputChange} required />
						</div>
						<div>
							<input name="username" type="text" value={usernameInput} placeholder="Username" onChange={handleInputChange} required />
						</div>
					</>
				)}
				<div>
					<input type="submit" value={isLoginState ? 'Log in' : 'Sign up'} />
					{errorMessage}
				</div>
			</form>
			<div>
				{isLoginState ? "Don't have an account?" : 'Have an account?'}
				<span onClick={newAccountToggle}>{isLoginState ? ' Sign up' : ' Log in'}</span>
			</div>
		</div>
	);
}
