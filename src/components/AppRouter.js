import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import UserPage from 'routes/UserPage';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import AccountEdit from 'routes/AccountEditPage';
import PostPage from 'routes/PostPage';

export default function AppRouter({
	isLoggedIn,
	currentUserObject,
	refreshCurrentUserObject,
	userList,
	setUserList,
	isUserListDisplayed,
	toggleUserListDisplayed,
}) {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Auth isLoggedIn={isLoggedIn} />
				</Route>
				<Route exact path="/home">
					<Home
						isLoggedIn={isLoggedIn}
						currentUserObject={currentUserObject}
						userList={userList}
						setUserList={setUserList}
						isUserListDisplayed={isUserListDisplayed}
						toggleUserListDisplayed={toggleUserListDisplayed}
					/>
				</Route>
				<Route path="/user/:username">
					<UserPage
						isLoggedIn={isLoggedIn}
						currentUserObject={currentUserObject}
						userList={userList}
						setUserList={setUserList}
						isUserListDisplayed={isUserListDisplayed}
						toggleUserListDisplayed={toggleUserListDisplayed}
					/>
				</Route>
				<Route path="/account/edit">
					<AccountEdit isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} refreshCurrentUserObject={refreshCurrentUserObject} />
				</Route>
				<Route path="/post/:postId">
					<PostPage
						isLoggedIn={isLoggedIn}
						currentUserObject={currentUserObject}
						userList={userList}
						setUserList={setUserList}
						isUserListDisplayed={isUserListDisplayed}
						toggleUserListDisplayed={toggleUserListDisplayed}
					/>
				</Route>
			</Switch>
		</Router>
	);
}
