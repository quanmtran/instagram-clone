import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

// Import components
import AccountPage from 'routes/AccountPage';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Nav from './Nav';

export default function AppRouter({ isLoggedIn, userObject }) {
	return (
		<Router>
			<Switch>
				<Route exact path="/">
					<Auth isLoggedIn={isLoggedIn} />
				</Route>
				<Route exact path="/home">
					<Nav userObject={userObject} />
					<Home isLoggedIn={isLoggedIn} userObject={userObject} />
				</Route>
				<Route path="/user/:username">
					<Nav userObject={userObject} />
					<AccountPage isLoggedIn={isLoggedIn} />
				</Route>
			</Switch>
		</Router>
	);
}
