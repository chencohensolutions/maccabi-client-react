import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, TextField } from "@mui/material";
import { Header } from "../../components/Header"
import { ChatRoomsClient, IRoom } from "../../services/ChatRoomsClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const chatRoomsClient = new ChatRoomsClient();

interface PropsDialogCreateRoom {
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreateRoom: (title: string) => void;
}

const DialogCreateRoom = ({ open, setOpen, onCreateRoom }: PropsDialogCreateRoom) => {
    const [title, setTitle] = useState('');
    const onCancel = () => {
        setOpen(false);
        setTitle('');
    };
    const onSubmit = () => {
        onCreateRoom(title);
        onCancel();
    };
    return (
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
                <DialogContentText id="alert-dialog-description">
                    <TextField type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Room Title" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
};

export const PageRooms = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [dialogCreateRoomOpen, setDialogCreateRoomOpen] = useState(false);
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
            <Button variant="contained" onClick={() => setDialogCreateRoomOpen(true)}>Create Room</Button>

            <DialogCreateRoom open={dialogCreateRoomOpen} onCreateRoom={onCreateRoom} setOpen={setDialogCreateRoomOpen} />
            <List>
                {rooms.map((room) => (
                    <ListItem key={room.id} onClick={()=>{
                        navigate(`/rooms/${room.id}`);
                    }}>{room.title}</ListItem>
                ))}

            </List>
        </Box>)
};