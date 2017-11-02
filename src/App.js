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
      queryCateg: [],
      updatingBook: undefined
    }

    this.updateBookStatus = this.updateBookStatus.bind(this)
    this.searchCategories = this.searchCategories.bind(this)
  }

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

  updateBookStatus(book, shelf) {
    this.setState({ updatingBook: true })
    BooksAPI.update(book, shelf).then((books) => {
      BooksAPI.getAll().then((books) => {
        this.setState({ books })
        this.setState({ updatingBook: false })
      })
    })
  }

  searchCategories(e) {
    e.preventDefault()

    const value = document.querySelector("#inputSearchCateg").value

    BooksAPI.search(value, 20).then((queryCateg) => {
      // console.log(queryCateg)
      this.setState({ queryCateg })
    })
  }

  render() {

    const { books, query, queryCateg, updatingBook } = this.state

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
                    <form method="post" name="searchForm" onSubmit={this.searchCategories}>
                      <input type="text" placeholder="Search by categorie" id="inputSearchCateg" />
                      <button type="submit" className="btn blue-grey">Search by Categorie</button>
                    </form>
                  </div>
                </div>
                <If test={ queryCateg !== undefined }>
                  <BookShelf
                    shelfName="Books by Categorie"
                    books={queryCateg}
                    updateBookStatus={this.updateBookStatus}
                    booksLibrary={showingBooks}
                  />
                </If>
                <If test={ queryCateg.length === 0 }>
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
