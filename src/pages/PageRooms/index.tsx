import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, List, ListItem, TextField, Toolbar } from "@mui/material";
import { Header } from "../../components/Header"
import { ChatRoomsClient, IRoom } from "../../services/ChatRoomsClient";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";


const chatRoomsClient = new ChatRoomsClient();

interface PropsDialogCreateRoom {
    onCreateRoom: (title: string) => void;
}

const ButtonCreateRoom = ({ onCreateRoom }: PropsDialogCreateRoom) => {
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false);
    const onCancel = () => {
        setOpen(false);
        setTitle('');
    };
    const onSubmit = () => {
        setOpen(false);
        setTitle('');
        onCreateRoom(title);
    };
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>Create Room</Button>
            <Dialog
                open={open}
                onClose={onCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Create Room
                </DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormLabel htmlFor="newUserName">Room Title</FormLabel>
                        <TextField type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onSubmit}>Create</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>

    )
};

export const PageRooms = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        chatRoomsClient.initRooms(setRooms);
    }, []);

    const onCreateRoom = (title: string) => {
        chatRoomsClient.createRoom(title);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header />
            <Toolbar>
                <ButtonCreateRoom onCreateRoom={onCreateRoom} />
            </Toolbar>
            <List>
                {rooms.map((room) => (
                    <ListItem key={room.id} onClick={() => {
                        navigate(`/rooms/${room.id}`);
                    }}>{room.title}</ListItem>
                ))}
            </List>
        </Box>)
};