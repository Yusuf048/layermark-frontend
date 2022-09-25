import ImageListItem from "@mui/material/ImageListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ImageList from "@mui/material/ImageList";
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import {BookApi} from "../api/BookApi";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    borderRadius: 3,
};

const BookList = ({start, end, filteredBooks, setFilteredBooks, obj}) => {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance"];

    const [openModal, setOpenModal] = useState(false);
    const [itemOpened, setItemOpened] = useState(-1);
    const [authorOpened, setAuthorOpened] = useState("");
    const [bookOpened, setBookOpened] = useState("");
    const [imgOpened, setImgOpened] = useState("");

    // Constants for editing
    const [authorChange, setAuthorChange] = useState("");
    const [bookChange, setBookChange] = useState("");
    const [imgChange, setImgChange] = useState("");
    const [genreChange, setGenreChange] = useState("");
    const [dateChange, setDateChange] = useState("");

    const [openEditModal, setOpenEditModal] = useState(false);

    const bookApi = new BookApi();


    // Fetch all books by genres
    function fetchBooksByGenre() {
        setFilteredBooks([{genre: "", books: []}]);
        for (let i = 0; i < allGenres.length; i++) {
            bookApi.getBooksByGenre(allGenres[i], start, end).then(data => {
                setFilteredBooks(oldArray => [...oldArray, {genre: allGenres[i], books: data}]);
            });
        }
    }

    // Open modal with book information
    const fetchModal = (itemId, author, bookName, imgUrl) => {
        setOpenModal(true);
        setItemOpened(itemId);
        setAuthorOpened(author);
        setBookOpened(bookName);
        setImgOpened(imgUrl);
    };
    // Close modal
    const handleModalClose = () => {
        setOpenModal(false);
        setItemOpened(-1);
        setAuthorOpened("");
        setBookOpened("");
        setImgOpened("");
    };

    // Editing modal
    const openEditor = () => {
        setOpenEditModal(true);
    }
    const handleEditorClose = () => {
        setOpenEditModal(false);
        setAuthorChange("");
        setBookChange("");
        setGenreChange("");
        setImgChange("");
    }
    const handleEdit = () => {
        bookApi.editBook(itemOpened, bookChange, authorChange, imgChange, genreChange).then(data => {
            console.log(data);
        });
    }

    const changeAuthor = (event) => {
        setAuthorChange(event.target.value);
    };
    const changeBook = (event) => {
        setBookChange(event.target.value);
    };
    const changeGenre = (event) => {
        setGenreChange(event.target.value);
    };
    const changeImg = (event) => {
        setImgChange(event.target.value);
    };
    const changeDate = (event) => {
        setDateChange(event.target.value);
    };

    // Delete selected book
    const handleDelete = () => {
        setOpenModal(false);
        setOpenModal(false);
        bookApi.deleteBook(itemOpened).then(data => {
            console.log(data);
        });
        fetchBooksByGenre(start, end);
    }

    return (
        <div>
            <Box
                sx={{
                    width: '100%',
                    height: 32,
                    backgroundColor: "rgba(134,120,155,0.35)",
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Typography variant="h5" gutterBottom >
                    {obj.genre}
                </Typography>
            </Box>
                <div className="Image-lists">
                    <ImageList sx={{ width: "100%", height: 450}} cols={7}>
                        {(obj.books).map((item) => (
                            <ImageListItem key={item.id} sx={{width: 230, height: "inherit", borderRadius: 1}}>
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
                                            onClick={() => fetchModal(item.id, item.author, item.bookName, item.imgUrl)}
                                        >
                                            <InfoIcon/>
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <Modal
                        // hideBackdrop
                        open={openModal}
                        onClose={handleModalClose}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description"
                    >
                        <Box sx={{ ...style, width: 400 }}>
                            <h2 id="parent-modal-title">{bookOpened}</h2>
                            <p id="parent-modal-description">
                                Author name: {authorOpened}
                            </p>
                            <Typography variant="body2" gutterBottom>
                                Image Url: {imgOpened}
                            </Typography>
                            <div className="buttons">
                                <Button onClick={handleDelete}>Delete Book</Button>

                            </div>


                        </Box>
                    </Modal>

                    <Modal
                        hideBackdrop
                        open={openEditModal}
                        onClose={handleEditorClose}
                        aria-labelledby="child-modal-title"
                        aria-describedby="child-modal-description"
                    >
                        <Box sx={{ ...style, width: 200 }}>
                            <TextField id="outlined-basic" label="Author Name" variant="outlined" onChange={changeAuthor}/>
                            <TextField id="outlined-basic" label="Book Name" variant="outlined" onChange={changeBook}/>
                            <TextField id="outlined-basic" label="Image URL" variant="outlined" onChange={changeImg}/>
                            <TextField id="outlined-basic" label="Genre Name" variant="outlined" onChange={changeGenre}/>
                            <Button onClick={handleEditorClose}>Cancel</Button>
                            <Button onClick={handleEdit}>Save Changes</Button>
                        </Box>
                    </Modal>
                </div>
        </div>


    );
}
export default BookList;