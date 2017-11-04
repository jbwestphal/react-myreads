import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import If from './Components/If'
import escapeRegExp from 'escape-string-regexp'
import Header from './Modules/Header'
import Footer from './Modules/Footer'
import BookShelf from './Components/BookShelf'
import BookDetail from './Components/BookDetail'
import './vendor/materializeCss/materialize.css'
import './App.css'

class BooksApp extends Component {

  constructor(props) {

    super(props)
    this.state = {
      books: [],
      query: '',
      queryCateg: [],
      showLoader: false,
      updatingBook: undefined
    }

    this.updateBookStatus = this.updateBookStatus.bind(this)

    // search books by categories in the API
    this.searchCategories = this.debounce(() => {
      const value = document.querySelector("#inputSearchCateg").value
      this.setState({ showLoader: true })
      BooksAPI.search(value, 20).then((queryCateg) => {
        this.setState({ queryCateg })
        this.setState({ showLoader: false })
      }).catch((error) => {
        this.setState({ queryCateg: [] })
        this.setState({ showLoader: false })
      })

    }, 300);

  }

  // generic debounce function for events
  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  // update the library by search query
  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  // clear the library by search query
  clearQuery = () => {
      this.setState({ query: '' })
  }

  // update the book's status
  updateBookStatus(book, shelf) {
    this.setState({ updatingBook: true })
    BooksAPI.update(book, shelf).then((books) => {
      BooksAPI.getAll().then((books) => {
        this.setState({ books })
        this.setState({ updatingBook: false })
      })
    })
  }

  render() {

    const { books, query, queryCateg, showLoader, updatingBook } = this.state

    let showingBooks

    if(query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = books.filter((book) => match.test(book.title) || match.test(book.authors))
    } else {
        showingBooks = books
    }

    // object for management of book's shelfs
    const booksShelf = [
      { id: 0, title: 'Currently Reading', status: books.filter((book) => book.shelf === 'currentlyReading') },
      { id: 1, title: 'Want to Read', status: books.filter((book) => book.shelf === 'wantToRead') },
      { id: 2, title: 'Read', status: books.filter((book) => book.shelf === 'read') }
    ]

    return (
      <section className="app">
        <Header />
        <main>
          <Route exact path="/" render={() => (
            <div className="list-books">
              <div className="list-books-content">
                {
                  booksShelf.map(item => (
                    <BookShelf
                      key={item.id}
                      books={item.status}
                      shelfName={item.title}
                      updateBookStatus={this.updateBookStatus}
                    />
                  ))
                }
              </div>
              <If test={ updatingBook === true }>
                <div className="loading-wrapper loading-wrapper-float">Loading...</div>
              </If>
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
                  <input
                    type="text"
                    placeholder="Search by title or author"
                    value={query}
                    onChange={(event) => this.updateQuery(event.target.value)}
                  />
                </div>
              </div>

              <div className="search-books-results">
                <If test={ showingBooks.length !== books.length }>
                  <div className="card-panel teal center-align">
                    <span className="white-text">Now showing {showingBooks.length} of {books.length} total</span> &nbsp;
                    <button onClick={this.clearQuery} className="btn blue-grey lighten-5 black-text">Show all books</button>
                  </div>
                </If>
                <BookShelf
                  books={showingBooks}
                  shelfName="Your Library"
                  updateBookStatus={this.updateBookStatus}
                />
              </div>
              <div className="search-books-results search-books-results--category">
                <div className="search-books-bar search-categories-bar">
                  <div className="search-books-input-wrapper">
                    <form name="searchForm">
                      <input
                        type="text"
                        placeholder="Search by category"
                        id="inputSearchCateg"
                        autoComplete="off"
                        onKeyUp={this.searchCategories}
                      />
                    </form>
                  </div>
                </div>
                <If test={ queryCateg !== undefined }>
                  <BookShelf
                    shelfName="Books by Category"
                    books={queryCateg}
                    updateBookStatus={this.updateBookStatus}
                    booksLibrary={showingBooks}
                  />
                </If>
                <If test={ showLoader === true }>
                  <div className="loading-wrapper">Loading...</div>
                </If>
                <If test={ queryCateg.length === 0 && showLoader === false }>
                  <div className="container center-align">
                    <h4>No books found.</h4>
                  </div>
                </If>
              </div>
              <If test={ updatingBook === true }>
                <div className="loading-wrapper loading-wrapper-float">Loading...</div>
              </If>
            </div>
          )} />

          <Route path="/books/:bookId" render={({match}) => (
            <div>
              <BookDetail bookId={match.params.bookId} />
            </div>
          )} />

        </main>
        <Footer />
      </section>
    )
  }
}

export default BooksApp
