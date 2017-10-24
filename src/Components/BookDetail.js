import React, { Component } from 'react'
import * as BooksAPI from '../BooksAPI'
import { Link } from 'react-router-dom'

class BookDetail extends Component {

	state = {
		bookRender: []
	}

	componentDidMount() {
		BooksAPI.get(this.props.bookId).then((bookRender) => {
			this.setState({ bookRender })

		})
	}

	render() {

    const { bookRender } = this.state

		return (
			<section className="book-detail">
				<header className="book-detail-header">
					<Link
							to="/"
							className="close-search"
					>Go Back</Link>
					<h2 className="bookshelf-title">{bookRender.title}</h2>
				</header>

				<article className="book-detail-article">

				</article>
			</section>
		)
	}
}

export default BookDetail