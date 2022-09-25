import axios from "axios";

const BOOK_API_URL = 'http://localhost:8080/book'
/*export interface BookQueryResponse {
    id: number;
    username: string;
    password: string;
}*/

export class BookApi {
    /*async getBooks(): Promise<BookQueryResponse>{
        const response = await axios.get<BookQueryResponse>(BOOK_API_URL);
        return response.data;
    }*/
    async getBooks() {
        const response = await axios.get(BOOK_API_URL);
        return response.data;
    }

    async getBooksByGenre(genre, start, end) {
        const response = await axios.get( `${BOOK_API_URL}/${genre}/${start}/${end}`);
        return response.data;
    }

    async getBooksByGenreFiltered(genre, start, end, author, bookName) {
        const response = await axios.get( `${BOOK_API_URL}/${genre}/${start}/${end}/${author}/${bookName}`);
        return response.data;
    }

    async editBook(bookId, bookName, author, imgUrl, genre) {
        const bookData = JSON.stringify({ author: author, bookName: bookName, imgUrl:imgUrl, genre:genre });
        const response = await axios.put(`${BOOK_API_URL}/${bookId}`, bookData);
        return response.data;
    }

    async deleteBook(bookId) {
        const response = await axios.delete(`${BOOK_API_URL}/${bookId}`);
        return response.data;
    }
}

//export default new BookApi();