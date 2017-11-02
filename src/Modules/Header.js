import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header = () => {

	return (
		<header className="header-main-wrapper">
			<h1><Link to="/" className="header-logo">MyReads</Link></h1>
			<nav className="header-nav">
				<NavLink activeClassName='active' to='/' exact>My Books</NavLink>
				<NavLink activeClassName='active' to='/search'>Search Books</NavLink>
			</nav>
		</header>
	)
}

export default Header