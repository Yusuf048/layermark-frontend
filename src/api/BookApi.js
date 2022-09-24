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

    async getBooksByGenreAuthor(genre, author) {
        const response = await axios.get( `${BOOK_API_URL}/${genre}/${author}`);
        return response.data;
    }
}

//export default new BookApi();