import React from 'react'
import Book from './Book'

const BookShelf = (props) => {

	return (
		<div className="bookshelf">
			<h2 className="bookshelf-title">{props.shelfName}</h2>
			<div className="bookshelf-books">
				<Book
					books={props.books}
					updateBookStatus={props.updateBookStatus}
				/>
			</div>
		</div>
	)
}

export default BookShelf