import React from 'react'
import sortBy from 'sort-by'
import If from './If'
import { Link } from 'react-router-dom'


const Book = ({ books, booksLibrary, updateBookStatus }) => {

	const booksNotInTheShelf = (books, booksLibrary) => {
		let newBooksArray = []

		books.forEach(function(b) {
			let exists = booksLibrary.some(function (bl) {
				return b.id === bl.id;
			});

			// Inserts in the new array only books that are not in the user's shelf
			if (!exists) newBooksArray.push(b)
		});

		return newBooksArray;
	}

	if(booksLibrary !== undefined) {
		books = booksNotInTheShelf(books, booksLibrary)
	}

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
								<select
									name="bookStatus"
									onChange={(e) => updateBookStatus(book, e.target.value)}
									defaultValue={book.shelf === undefined ? 'none' : book.shelf}>
									<option value="moveto" disabled>Move to...</option>
									<option value="currentlyReading">Currently Reading</option>
									<option value="wantToRead">Want to Read</option>
									<option value="read">Read</option>
									<option value="none">None</option>
								</select>
							</div>
						</div>
						<div className="book-title">{book.title}</div>
						<If test={ book.authors !== undefined }>
							<div className="book-authors">{book.authors}</div>
						</If>
					</div>
				</li>
			) ) }
		</ol>
	)

}

export default Book