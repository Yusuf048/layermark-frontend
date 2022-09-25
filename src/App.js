import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import moment from 'moment';

import {BookApi} from "./api/BookApi";
import BookList from "./components/BookList";

function App() {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance", "Biography"];

    const [genreBooks, setGenreBooks] = useState([{genre: "", books: []}]);
    const [authorName, setAuthorName] = useState("");
    const [bookName, setBookName] = useState("");

    // Constants for date picker
    const now = new Date();
    const startt = moment(
        new Date(now.getFullYear() - 20, 1, 1, 0, 0, 0, 0)
    );
    const ends = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0))
    const [start, setstart] = useState(startt);
    const [end, setend] = useState(ends);

    const ranges = {
        'Today Only': [moment(start), moment(end)],
        'Yesterday Only': [
            moment(start).subtract(1, 'days'),
            moment(end).subtract(1, 'days')
        ],
        '30 Days': [moment(start).subtract(30, 'days'), moment(end)]
    };
    const local = {
        format: 'YYYY-MM-DD HH:mm',
        // format: 'MM',
        sundayFirst: false
    };

    // Call bookApi for axios functions
    const bookApi = new BookApi();

    // Fetch all books by genre
    function fetchBooksByGenre(beginDate, endDate) {
        setGenreBooks([{genre: "", books: []}]);
        for (let i = 0; i < allGenres.length; i++){
            bookApi.getBooksByGenre(allGenres[i], beginDate, endDate).then(data => {
                if(data.length !== 0){
                    setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);

                }
            });
        }
    }

    // Fetch filtered books by genre
    function fetchBooksByGenreFiltered(startDate, endDate, author, book) {
        setGenreBooks([{genre: "", books: []}]);
        if((author === "" || author === "Author Name") && (book === "" || book === "Book Name")){
            for (let i = 0; i < allGenres.length; i++) {
                bookApi.getBooksByGenre(allGenres[i], startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')).then(data => {
                    setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
                });
            }
        } else {
            for (let i = 0; i < allGenres.length; i++) {
                if (book === "")
                    book = "Book Name";
                if (author === "")
                    author = "Author Name";

                bookApi.getBooksByGenreFiltered(allGenres[i], startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), author, book).then(data => {
                    setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
                });
            }
        }
    }

    // Function called when the apply button on date picker is clicked
    const applyCallback = (startDate, endDate) => {
        setstart(startDate);
        setend(endDate);
    };

    // Functions called for filtering
    const onSearchClick = () => {
        fetchBooksByGenreFiltered(start, end, authorName, bookName);
    };
    const changeAuthor = (event) => {
        setAuthorName(event.target.value);
    };
    const changeBook = (event) => {
        setBookName(event.target.value);
    };

    useEffect(() => {
        fetchBooksByGenre(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    }, []);

    return (
      <Router>
        <div className="App">
            <header className="App-header">
                <AppBar position="static">
                    <Toolbar>
                        <Button color="inherit" sx={{width: 150}}/>
                        <Typography variant="h5" component="div" sx={{ flexGrow: 1}}>
                            Book Collection
                        </Typography>
                        <Button color="inherit" sx={{width: 150}}></Button>
                    </Toolbar>
                </AppBar>
            </header>
            <div className="App-body">
                <div className="Filtering-body">
                    <Accordion sx={{backgroundColor: "rgba(201,239,245,0.2)", marginBottom: "18px"}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Filtering</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{display:"flex", justifyContent: "space-around"}}>
                            <DateTimeRangeContainer
                                ranges={ranges}
                                start={start}
                                end={end}
                                local={local}
                                applyCallback={applyCallback}
                                // leftMode={true}
                                style={{ height: '110px' }}
                            >

                                <TextField
                                    id="outlined-helperText"
                                    label="Release Date"
                                    value={`${start.format('MM/DD/YYYY')} - ${end.format('MM/DD/YYYY')}`}
                                />
                            </DateTimeRangeContainer>
                            <TextField id="outlined-basic" label="Author Name" variant="outlined" onChange={changeAuthor}/>
                            <TextField id="outlined-basic" label="Book Name" variant="outlined" onChange={changeBook}/>
                            <Button variant="contained" onClick={onSearchClick}>Search</Button>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div className="App-books" >
                    {
                        genreBooks.map(obj => {
                            if (obj.genre === "Action and Adventure" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Fantasy" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Historical" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Science Fiction" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Thriller" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Classics" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Historical Fiction" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Mystery" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Romance" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                            if (obj.genre === "Biography" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj}/>
                                );
                            }
                        })
                    }
                </div>
            </div>
        </div>
      </Router>
    );
}

export default App;
