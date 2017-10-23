import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import Book from './Book'

class BookShelf extends Component {

	render() {
		return (
			<div className="bookshelf">
				<h2 className="bookshelf-title">{this.props.shelfName}</h2>
				<div className="bookshelf-books">
				<ol className="books-grid">
						<Book books={this.props.books} />
				</ol>
				</div>
			</div>
		)
	}
}

export default BookShelf