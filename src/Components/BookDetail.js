import React, { Component } from 'react'
import * as BooksAPI from '../BooksAPI'
import { Link } from 'react-router-dom'

class BookDetail extends Component {

	state = {
		book: []
	}

	componentDidMount() {
		BooksAPI.get(this.props.bookId).then((book) => {
			this.setState({ book })
		})
	}

	render() {

		const { book } = this.state
		let bookThumbnail = ''
		let bookAuthors = ''

		if( book.imageLinks !== undefined ) {
			bookThumbnail = book.imageLinks.thumbnail
		}

		if( book.authors !== undefined ) {
			bookAuthors = book.authors.map((author,index) => (
				<p key={index}>{author}</p>
			))
		}

		return (
			<section className="book-detail">
				<header className="book-detail-header">
					<Link to="/" className="close-search">Go Back</Link>
					<h2 className="bookshelf-title">{book.title}</h2>
				</header>

				<article className="book-detail-article">
					<a href={book.previewLink}>Preview</a>
					<p className="book-"><img src={ bookThumbnail } alt={book.title} /> </p>
					<p className="book-">Language: {book.language}</p>
					<p className="book-">Publish Date: {book.publishDate}</p>
					<p className="book-">{book.description}</p>
					<p className="book-">Page Count: {book.pageCount}</p>
					<div className="book-authors">
						Authors: <br />
						{
							bookAuthors
						}
					</div>
					<div>
						Shelf: {book.pageCount}
					</div>
				</article>
			</section>
		)
	}
}

export default BookDetail