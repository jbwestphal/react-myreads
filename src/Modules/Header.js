import React, { Component } from 'react'
import { Link, NavLink } from 'react-router-dom'

class Header extends Component {

	render() {
		return (
			<header className="header-main-wrapper">
				<h1><Link to="/" className="header-logo">MyReads</Link></h1>
				<nav className="header-nav">
					<NavLink exact activeClassName='active' to='/'>My Books</NavLink>
					<NavLink activeClassName='active' to='/search'>Search Books</NavLink>
				</nav>
			</header>
		)
	}
}

export default Header