import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';
import './App.css';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import moment from 'moment';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';



import TextField from '@mui/material/TextField';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {BookApi} from "./api/BookApi";
import BookList from "./components/BookList";

function App() {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance", "Biography"];
    const [books, setBooks] = useState([]);
    const [colLength, setColLength] = useState(1);

    const [genreBooks, setGenreBooks] = useState([{genre: "", books: []}]);
    const [authorName, setAuthorName] = useState("");
    const [bookName, setBookName] = useState("");

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

    const [actionBooks, setActionBooks] = useState([]);
    const [fantasyBooks, setFantasyBooks] = useState([]);
    const [historicalBooks, setHistoricalBooks] = useState([]);
    const [sciFiBooks, setSciFiBooks] = useState([]);
    const [thrillerBooks, setThrillerBooks] = useState([]);
    const [classicsBooks, setClassicsBooks] = useState([]);
    const [histFiBooks, setHistFiBooks] = useState([]);
    const [mysteryBooks, setMysteryBooks] = useState([]);
    const [romanceBooks, setRomanceBooks] = useState([]);

    const bookApi = new BookApi();

    function fetchBooks() {
        bookApi.getBooks()
            .then(data => {
                setBooks(data);
                if (data.length < 6) {
                    setColLength(data.length);
                } else {
                    setColLength(5);
                }
            });
    }

    function fetchBooksByGenre(beginDate, endDate) {
        //let tempBooks = [{genre: "", books: []}];
        //for (let i = 0; i < allGenres.length; i++){
            //tempBooks.push({genre: allGenres[i], books: []});
            //setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: []}]);
        //}
        for (let i = 0; i < allGenres.length; i++){
            bookApi.getBooksByGenre(allGenres[i], beginDate, endDate).then(data => {
                if(data.length !== 0){
                    setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
                    /*const tempBooks = genreBooks.map((value, index, array) => {
                        if (value.books !== data && index+1 === i) {
                            return {genre: allGenres[i], books: data};
                        } else {
                            return value;
                        }
                    });
                    console.log(tempBooks);
                    setGenreBooks(tempBooks);*/

                    //tempBooks[i].books = data;

                }

                console.log(allGenres[i]);
                console.log(i);
                console.log(data.length);
            });
        }
        //setGenreBooks(tempBooks);
        /*allGenres.forEach(genre => {
            bookApi.getBooksByGenre(genre).then(data => {
                setGenreBooks(oldArray => [...oldArray, {genre: genre, books: data}]);
                console.log(genre);
                console.log(data);
            });

        })*/
        /*bookApi.getBooksByGenre().then(data =>{
            setGenres(data);
            console.log(data);
            console.log(typeof(data));
        })*/
    }
    function fetchBooksByGenreFiltered(startDate, endDate, author, book) {
        setGenreBooks([{genre: "", books: []}]);
        if((author === "" || author === "Author Name") && (book === "" || book === "Book Name")){
            author = "Author Name";
            book = "Book Name";
            for (let i = 0; i < allGenres.length; i++) {
                bookApi.getBooksByGenre(allGenres[i], startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')).then(data => {
                    console.log(data);
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
                    console.log(data);
                    setGenreBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
                });
            }
        }
    }

    const applyCallback = (startDate, endDate) => {
        setstart(startDate);
        setend(endDate);
        console.log("APPLY CALLBACK");
        const firstDate = startDate.format('MM');
        const lastDate = endDate.format('MM');
    };

    const onSearchClick = () => {
        fetchBooksByGenreFiltered(start, end, authorName, bookName);

    };
    const changeAuthor = (event) => {
        setAuthorName(event.target.value);
    };
    const changeBook = (event) => {
        setBookName(event.target.value);
    };

    const editBook = () => {

    };
    const parentBookDelete = (itemOpened) => {
        bookApi.deleteBook(itemOpened).then(data => {
            console.log(data);
        });
        fetchBooksByGenre(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    };



    useEffect(() => {
        // fetchBooks();
        fetchBooksByGenre(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    }, []);

    /*
    * <Avatar
                            sx={{ bgcolor: deepOrange[500] }}
                            alt="Yusuf Alpdemir"
                            src="/broken-image.jpg"
                        />*/

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
                        <Button color="inherit" sx={{width: 150}}>Add Book</Button>
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
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Fantasy" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Historical" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Science Fiction" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Thriller" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Classics" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Historical Fiction" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Mystery" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Romance" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
                                );
                            }
                            if (obj.genre === "Biography" && obj.books.length !== 0) {
                                return (
                                    <BookList start={start.format('YYYY-MM-DD')} end={end.format('YYYY-MM-DD')}
                                              filteredBooks={genreBooks} setFilteredBooks={setGenreBooks} obj={obj} parentBookDelete={parentBookDelete}/>
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
