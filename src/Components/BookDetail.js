import React, { Component } from 'react'
import * as BooksAPI from '../BooksAPI'
import If from '../Components/If'

class BookDetail extends Component {

	state = {
		book: []
	}

	componentDidMount() {
		BooksAPI.get(this.props.bookId).then((book) => {
			this.setState({ book })
		})
	}

	goBack() {
		history.back();
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
				<span className="book-author-name" key={index}>{author}</span>
			))
		}

		return (
			<section className="container book-detail">
				<header className="book-detail-header">
					<a onClick={this.goBack} className="close-search" title="Go Back">Go Back</a>
					<h2 className="header grey-text">{book.title}</h2>
				</header>

				<If test={ book.authors === undefined }>
					<div className="loading-wrapper">Loading...</div>
				</If>

				<If test={ book.authors !== undefined }>
					<section>
						<article className="col s12 m7">
							<div className="card horizontal">
							<div className="card-image">
								<img src={ bookThumbnail } alt={book.title} />
							</div>
							<div className="card-stacked">
								<div className="card-content">
									<p><strong className="grey-text">Your Shelf:</strong> {book.shelf}</p>
									<p><strong className="grey-text">Publish Date:</strong> {book.publishedDate}</p>
									<p><strong className="grey-text">Language:</strong> {book.language} &nbsp; | &nbsp; <strong className="grey-text">Page Count:</strong> {book.pageCount}</p>
								</div>
								<div className="card-action">
									<a href={book.previewLink} target="_blank">Book's Preview</a>
								</div>
							</div>
							</div>
						</article>
						<article className="book-detail-article">
							<h3 className="grey-text">Book Description</h3>
							<p>{book.description}</p>
							<h4 className="grey-text">Author(s)</h4>
							<p>{bookAuthors}</p>
						</article>
					</section>
				</If>
			</section>
		)
	}
}

export default BookDetail