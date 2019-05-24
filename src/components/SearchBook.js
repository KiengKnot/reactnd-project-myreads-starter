import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import * as BooksAPI from './../BooksAPI';
import SearchAppBar from './SearchAppBar';
import BookCardList from './BookCardList';


class SearchBook extends React.Component {

    state = {
        searchBooks: [],
        hasError: false
    }

    filterBook = (books, shelf) => books.filter(b => b.shelf === shelf || (shelf === "none" && !b.shelf));


    handleOnSearch = (search, isDelayed) => {
        if (search.trim()) {

            // if (isDelayed) {
            //     setTimeout(function () {
            //         this.doQuery(search);
            //     }.bind(this), 600);
            // } else {
            this.doQuery(search.trim());
            // }
        } else {
            this.setState({ searchBooks: [] })
        }
    }

    doQuery = (search) => {
        BooksAPI.search(search)
            .then(newBooks => {
                console.log(newBooks)
                if (newBooks && newBooks.length > 0) {
                    if (Array.isArray(newBooks)) {
                        // this.setState((prev) => ({
                        //     searchBooks:
                        //         prev.searchBooks.concat([...newBooks.filter(
                        //             n => !prev.searchBooks.map(b => b.id).join(" ").includes(n.id)
                        //         )])
                        // }))
                        newBooks = newBooks.map(nb => {
                            const matched = this.props.books.filter(b => b.id === nb.id && b.shelf);
                            if (matched.length > 0) {
                                return matched.map(m => ({ ...nb, shelf: m.shelf }))[0]
                            } else {
                                return nb;
                            }
                        })
                        this.setState({ searchBooks: newBooks, hasError: false });
                    } else {
                        this.setState({ searchBooks: [], hasError: true })
                    }
                } else {
                    this.setState({ searchBooks: [] })
                }
            })
    }

    handleShelfChanged = (book, shelfId) => {
        this.props.onShelfChanged(book, shelfId)
        this.setState((prev) => ({ searchBooks: [...prev.searchBooks.map(b => b.id === book.id ? { ...b, shelf: shelfId } : b)] }))
    }

    handleRedirect = () => {
        this.props.history.push("/")
    }

    render() {
        const { shelves } = this.props;
        const { searchBooks, hasError } = this.state
        const bookShelf = {
            "wantToRead": this.filterBook(searchBooks, "wantToRead"),
            "currentlyReading": this.filterBook(searchBooks, "currentlyReading"),
            "read": this.filterBook(searchBooks, "read"),
            "none": this.filterBook(searchBooks, "none"),
        }
        return (
            <div>
                <SearchAppBar
                    title="Search Books"
                    onChange={(event) => this.handleOnSearch(event.currentTarget ? event.currentTarget.value : '', true)}
                    onSearch={(event) => this.handleOnSearch(event.currentTarget ? event.currentTarget.value : '', false)}
                    onClose={this.handleRedirect}
                />

                {hasError && <label>Search not match</label>}

                {
                    shelves.map(s => (
                        bookShelf[s.id].length > 0 &&
                        <div key={"div_" + s.id}>
                            <h2>{s.label}</h2>
                            <BookCardList books={bookShelf[s.id]} handleShelfChanged={this.handleShelfChanged} />
                        </div>
                    ))
                }
                {
                    bookShelf.none.length > 0 &&
                    <div>
                        <h2>Currently not on any shelf</h2>
                        <BookCardList books={bookShelf.none} handleShelfChanged={this.handleShelfChanged} />
                    </div>
                }

            </div>
        );
    }

}
SearchBook.propTypes = {
    onShelfChanged: PropTypes.func.isRequired,
    shelves: PropTypes.array.isRequired,
    books: PropTypes.array.isRequired
}

export default withRouter(SearchBook);