import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './vendor/materializeCss/materialize.css'
import './App.css'
import BookShelf from './BookShelf'

class BooksApp extends Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    books: [],
    showSearchPage: false
  }

  // get books from API
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
      console.log(books)
    })
  }

  render() {
    return (
      <div className="app">

        <Route exact path="/" render={() => (

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>

                <BookShelf
                  books={this.state.books}
                  shelfName="Currently Reading" />

                <BookShelf
                  books={this.state.books}
                  shelfName="Want to Read" />

                <BookShelf
                  books={this.state.books}
                  shelfName="Read" />

              </div>
            </div>
            <div className="open-search">
              <Link
                to="/search"
              >Add a book</Link>
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
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp
