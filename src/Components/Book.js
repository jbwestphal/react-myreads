import React, { Component } from 'react'
import sortBy from 'sort-by'
import { Link } from 'react-router-dom'

class Book extends Component {

	state = {
		bookStatus: ''
	}

	render() {

		const { books } = this.props

		books.sort(sortBy('title'))

		return (
			<ol className="books-grid">
				{books.map(book => (
					<li key={book.id}>
						<div className="book">
							<div className="book-top">
								<Link to={`books/${book.id}`}>
									<img src={book.imageLinks.smallThumbnail} alt={book.title} className="book-cover" />
								</Link>
								<div className="book-shelf-changer">
									<select>
										<option value="none" disabled>Move to...</option>
										<option value="currentlyReading">Currently Reading</option>
										<option value="wantToRead">Want to Read</option>
										<option value="read">Read</option>
										<option value="none">None</option>
									</select>
								</div>
							</div>
							<div className="book-title">{book.title}</div>
							<div className="book-authors">{
								book.authors.map((author,index) => (
									<span className="book-author-name" key={index}>{author}</span>
								))
							}</div>
						</div>
					</li>
				 ) ) }
			</ol>
		)
	}
}

export default Book