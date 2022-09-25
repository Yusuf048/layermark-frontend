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

function ChildModal({itemOpened, setFilteredBooks, parentBookDelete, setOpenModal}) {
    const [open, setOpen] = React.useState(false);
    const bookApi = new BookApi();
    const [itemDeletion, setItemDeletion] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        setOpenModal(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setOpen(false);
        parentBookDelete(itemOpened);
    }

    useEffect(() => {

        setItemDeletion(false);
    }, [itemDeletion]);

    return (
        <React.Fragment>
            <Button onClick={handleOpen}>Delete Book</Button>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">Are you sure you want to delete?</h2>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>Yes</Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

const BookList = ({start, end, filteredBooks, setFilteredBooks, obj, parentBookDelete}) => {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance"];
    //const [genreBooks, setGenreBooks] = useState([{genre: "", books: []}]);
    const [colLength, setColLength] = useState(1);

    const [openModal, setOpenModal] = useState(false);
    const [itemOpened, setItemOpened] = useState(-1);
    const [authorOpened, setAuthorOpened] = useState("");
    const [bookOpened, setBookOpened] = useState("");
    const [imgOpened, setImgOpened] = useState("");

    const [authorChange, setAuthorChange] = useState("");
    const [bookChange, setBookChange] = useState("");
    const [imgChange, setImgChange] = useState("");
    const [genreChange, setGenreChange] = useState("");
    const [dateChange, setDateChange] = useState("");

    const [deleteBook, setDeleteBook] = useState(false);
    const [deleteBookId, setDeleteBookId] = useState(-1);



    const [openEditModal, setOpenEditModal] = useState(false);

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

    const fetchModal = (itemId, author, bookName, imgUrl) => {
        setOpenModal(true);
        setItemOpened(itemId);
        setAuthorOpened(author);
        setBookOpened(bookName);
        setImgOpened(imgUrl);
    };
    const handleModalClose = () => {
        setOpenModal(false);
        setItemOpened(-1);
        setAuthorOpened("");
        setBookOpened("");
        setImgOpened("");
    };

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
        console.log(bookChange);
        console.log(genreChange);
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

    const handleDelete = () => {
        setOpenModal(false);
        parentBookDelete(itemOpened);
    }

    useEffect(() => {
        console.log("BURDAYIM")
        //fetchBooksByGenre();
    }, [start]);


    // <ImageList sx={{ width: "100%", height: 700 , textAlign: "center"}} cols={colLength}>
    // </ImageList>
    // <ImageListItem key="Subheader" cols={5}>
    // div width: 1410  cols: 6
    /*<ImageList sx={{ width: 260, height: 450, borderRadius: 1}} cols={1}>
                                <ListSubheader component="div" sx={{backgroundColor: "#eaeaea"}}>
                                    <Typography variant="h5" gutterBottom>
                                        {obj.genre}
                                    </Typography>
                                </ListSubheader>
                            </ImageList>*/
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


                        <div className="asd">



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
                                                >
                                                    <InfoIcon onClick={() => fetchModal(item.id, item.author, item.bookName, item.imgUrl)}/>
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