import React, { Component } from "react";
import BookCard from './BookCard';
import PropTypes from 'prop-types';

const style = {
    shelfTab: {
        display: 'flex',
        flexWrap: "wrap"
    }
}

class BookCardList extends Component {

    render() {
        const { books, handleShelfChanged } = this.props;
        return (
            <div style={style.shelfTab}>
                {books.map(book => (
                    <BookCard
                        key={"book_" + book.id} book={book}
                        onShelfChanged={handleShelfChanged}
                    />
                ))}
            </div>
        );
    }

}

BookCardList.propTypes = {
    books: PropTypes.array.isRequired,
    handleShelfChanged: PropTypes.func.isRequired
}

export default BookCardList;