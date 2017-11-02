import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import escapeRegExp from 'escape-string-regexp'
import * as BooksAPI from './BooksAPI'
import './vendor/materializeCss/materialize.css'
import './App.css'
import Header from './Modules/Header'
import Footer from './Modules/Footer'
import If from './Components/If'
import BookShelf from './Components/BookShelf'
import BookDetail from './Components/BookDetail'

class BooksApp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      books: [],
      query: '',
      updatingBook: undefined
    }
    this.updateBookStatus = this.updateBookStatus.bind(this)
  }

  // get books from API
  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  componentWillMount() {
    const listBooks = window.localStorage.getItem('listBooks') || '[]'
    this.setState({ books: JSON.parse(listBooks) })
  }

  updateLocalStorage(books) {
    window.localStorage.setItem('listBooks', JSON.stringify(books))
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
      this.setState({ query: '' })
  }

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

    const { books, query } = this.state

    let showingBooks

    if(query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = books.filter((book) => match.test(book.title) || match.test(book.authors))
    } else {
        showingBooks = books
    }

    const booksReading = books.filter((book) => book.shelf === 'currentlyReading')
    const booksWantRead = books.filter((book) => book.shelf === 'wantToRead')
    const booksRead = books.filter((book) => book.shelf === 'read')

    const booksShelf = [
      { id: 0, title: 'Currently Reading', status: booksReading },
      { id: 1, title: 'Want to Read', status: booksWantRead },
      { id: 2, title: 'Read', status: booksRead }
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
              <If test={ this.state.updatingBook === true }>
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
                  shelfName="Books"
                  updateBookStatus={this.updateBookStatus}
                />
              </div>
              <If test={ this.state.updatingBook === true }>
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
