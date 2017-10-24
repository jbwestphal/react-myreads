import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import './vendor/materializeCss/materialize.css'
import './App.css'
import Header from './Modules/Header'
import Footer from './Modules/Footer'
import BookShelf from './Components/BookShelf'
import BookDetail from './Components/BookDetail'

class BooksApp extends Component {

  state = {
    books: [],
    query: ''
  }

  // get books from API
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
      this.setState({ query: '' })
  }

  render() {

    const { books, query } = this.state

    let showingBooks

    if(query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = books.filter((book) => match.test(book.title))
    } else {
        showingBooks = books
    }

    return (
      <div className="app">

        <Header />

        <main>

          <Route exact path="/" render={() => (

            <div className="list-books">

              <div className="list-books-content">
                <div>
                  <BookShelf
                    books={books}
                    shelfName="Currently Reading" />

                  <BookShelf
                    books={books}
                    shelfName="Want to Read" />

                  <BookShelf
                    books={books}
                    shelfName="Read" />
                </div>
              </div>
            </div>

          )} />

          <Route path="/search" render={() => (
            <div className="search-books">
              <div className="search-books-bar">
                <Link
                  to="/"
                  className="close-search"
                >Go Back</Link>
                <div className="search-books-input-wrapper">
                  {/*
                    NOTES: The search from BooksAPI is limited to a particular set of search terms.
                    You can find these search terms here:
                    https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                    However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                    you don't find a specific author or title. Every search is limited by search terms.
                  */}
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={query}
                    onChange={(event) => this.updateQuery(event.target.value)}
                  />

                </div>
              </div>
              <div className="search-books-results">
                <BookShelf
                    books={showingBooks}
                    shelfName="Books" />
              </div>
            </div>
          )} />

          <Route path="/books/:bookId" render={({match}) => (
            <div>
              <BookDetail bookId={match.params.bookId} />
            </div>
          )} />

        </main>

        <Footer />

      </div>
    )
  }
}

export default BooksApp
