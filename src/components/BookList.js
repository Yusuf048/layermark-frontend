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

function ChildModal({setDeleteBook}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleDelete = () => {
        setOpen(false);
        setDeleteBook(true);
    }

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

const BookList = ({start, end, filteredBooks, setFilteredBooks, obj}) => {
    const allGenres = ["Action and Adventure", "Fantasy", "Historical", "Science Fiction", "Thriller", "Classics", "Historical Fiction", "Mystery", "Romance"];
    //const [genreBooks, setGenreBooks] = useState([{genre: "", books: []}]);
    const [colLength, setColLength] = useState(1);

    const [openModal, setOpenModal] = useState(false);
    const [itemOpened, setItemOpened] = useState(-1);
    const [authorOpened, setAuthorOpened] = useState("");
    const [bookOpened, setBookOpened] = useState("");
    const [imgOpened, setImgOpened] = useState("");

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
                                        <Button >Edit Information</Button>
                                        <ChildModal />
                                    </div>


                                </Box>
                            </Modal>
                        </div>
        </div>


    );
}
export default BookList;