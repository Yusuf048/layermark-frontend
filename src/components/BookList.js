import ImageListItem from "@mui/material/ImageListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ImageList from "@mui/material/ImageList";
import React, { useEffect, useState } from 'react';
import {BookApi} from "../api/BookApi";


const BookList = ({start, end, filteredBooks, setFilteredBooks, obj}) => {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance"];
    //const [genreBooks, setGenreBooks] = useState([{genre: "", books: []}]);
    const [colLength, setColLength] = useState(1);
    const bookApi = new BookApi();


    function fetchBooksByGenre() {
        console.log(start);
        console.log(end);
        for (let i = 0; i < allGenres.length; i++) {
            bookApi.getBooksByGenre(allGenres[i], start, end).then(data => {
                //setFilteredBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
                const tempBooks = filteredBooks.map((value, index, array) => {
                    if (i === index){
                        value.genre = allGenres[i]
                        return value.books = data;
                    } else {
                        return value;
                    }
                });
                console.log(tempBooks);
                setFilteredBooks(tempBooks);
                if (data.length < 6) {
                    setColLength(data.length);
                } else {
                    setColLength(5);
                }
                console.log(allGenres[i]);
                console.log(i);
                console.log(data.length);
            });
        }
    }
    useEffect(() => {
        console.log("BURDAYIM")
        //fetchBooksByGenre();
    }, [start]);

    // <ImageList sx={{ width: "100%", height: 700 , textAlign: "center"}} cols={colLength}>
    // </ImageList>
    // <ImageListItem key="Subheader" cols={5}>
    return (


                        <div className="asd">

                            <ImageList sx={{ width: "100%", height: 450 , textAlign: "center"}} cols={5}>
                                    <ListSubheader component="div">{obj.genre}</ListSubheader>

                                {(obj.books).map((item) => (
                                    <ImageListItem key={item.id} sx={{width: "inherit", height: "inherit"}}>
                                        <img
                                            src={`${item.imgUrl}?w=248&fit=crop&auto=format`}
                                            srcSet={`${item.imgUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                            alt={item.author}
                                            loading="eager"
                                        />
                                        <ImageListItemBar
                                            title={item.bookName}
                                            subtitle={item.author}
                                            actionIcon={
                                                <IconButton
                                                    sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                    aria-label={`info about ${item.title}`}
                                                >
                                                    <InfoIcon />
                                                </IconButton>
                                            }
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </div>



    );
}
export default BookList;