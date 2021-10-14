import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import UserPage from 'routes/UserPage';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import AccountEdit from 'routes/AccountEditPage';

export default function AppRouter({ isLoggedIn, currentUserObject, refreshCurrentUserObject }) {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Auth isLoggedIn={isLoggedIn} />
				</Route>
				<Route exact path="/home">
					<Home isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} />
				</Route>
				<Route path="/user/:username">
					<UserPage isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} />
				</Route>
				<Route path="/account/edit">
					<AccountEdit isLoggedIn={isLoggedIn} currentUserObject={currentUserObject} refreshCurrentUserObject={refreshCurrentUserObject} />
				</Route>
			</Switch>
		</Router>
	);
}
