import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, TextField } from "@mui/material";
import { Header } from "../../components/Header"
import { useEffect, useState } from "react";
import api, { IUser } from "../../services/api";

import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

interface PropsDialogCreateUser {
    open: boolean;
    onCreateUser: (userName: string, password: string) => void;
    setOpen: (open: boolean) => void;
}
const DialogCreateUser = ({ open, setOpen, onCreateUser }: PropsDialogCreateUser) => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const onCancel = () => {
        setUserName('');
        setPassword('');
        setOpen(false);
    };
    const onSubmit = () => {
        onCreateUser(userName, password);
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
                Create User
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ display: "flex", flexDirection: "column" }}>
                    <TextField type="newUserName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" />
                    <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit}>Create</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
};

interface PropsDialogDeleteUser {
    onDeleteUser: (userName: string) => void;
    setUserName: (open: string | null) => void;
    userName: string | null;
}
const DialogDeleteUser = ({ userName, setUserName, onDeleteUser }: PropsDialogDeleteUser) => {
    const onCancel = () => {
        setUserName(null);
    };
    const onSubmit = () => {
        if (userName !== null)
            onDeleteUser(userName);
        setUserName(null);
    }
    return (
        <Dialog
            open={userName !== null}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Delete User
            </DialogTitle>
            <DialogActions>
                <Button onClick={onSubmit}>Delete</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export const PageUsers = () => {
    const [users, setUsers] = useState([]);
    const [dialogCreateUserOpen, setDialogCreateUser] = useState(false);
    const [dialogDeleteUserId, setDialogDeleteUserId] = useState<string | null>(null);

    const getUsers = async () => {
        const newUsers = await api.getUsers();
        setUsers(newUsers);
    };

    const onCreateUser = async (userName: string, password: string) => {
        const newUsers = await api.createUser(userName, password);
        setUsers(newUsers);
        setDialogCreateUser(false);
    }

    const onDeleteUser = async (userName: string) => {
        const newUsers = await api.deleteUser(userName);
        setUsers(newUsers);
    }

    useEffect(() => {
        getUsers();
    }, []);


    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header />
            <DialogCreateUser open={dialogCreateUserOpen} onCreateUser={onCreateUser} setOpen={setDialogCreateUser} />
            <DialogDeleteUser userName={dialogDeleteUserId} onDeleteUser={onDeleteUser} setUserName={setDialogDeleteUserId} />
            <Box sx={{ flexGrow: 1 }}>
                <Button variant="contained" onClick={() => setDialogCreateUser(true)}>Create User</Button>
                <List>
                    {users.map(({ id, userName }: IUser) => <ListItem key={id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="rename">
                                    <DriveFileRenameOutlineIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={
                                    () => {
                                        setDialogDeleteUserId(id);
                                    }
                                }>
                                    <DeleteIcon />
                                </IconButton>
                            </>

                        }
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <PersonIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={userName}
                        />
                    </ListItem>)}
                </List>
            </Box>
        </Box>)
};