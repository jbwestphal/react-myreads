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

  componentWillMount() {
    const listBooks = window.localStorage.getItem('listBooks') || '[]';
    this.setState({ books: JSON.parse(listBooks) });
  }

  updateLocalStorage(books) {
    window.localStorage.setItem('listBooks', JSON.stringify(books));
  }

  updateQuery = (query) => {
    this.setState({ query: query.trim() })
  }

  clearQuery = () => {
      this.setState({ query: '' })
  }

  updateBookStatus(target, task) {
    this.setState(function (state, b) {
      // const { items = [] } = state;
      // const s = items.filter(_ => _.id !== task.id);
      // task.status = target.checked ? 'Done' : 'To Do';
      // s.push(task);
      // this.updateLocalStorage(s);
      // return { books: s };
    });
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
                {showingBooks.length !== books.length && (
                    <div className="row">
                      <div className="col s12 m12">
                        <div className="card-panel teal">
                          <span className="white-text">Now showing {showingBooks.length} of {books.length} total</span> &nbsp;
                          <button onClick={this.clearQuery} className="btn blue-grey lighten-5 black-text">Show all books</button>
                        </div>
                      </div>
                    </div>
                )}
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

      </section>
    )
  }
}

export default BooksApp
