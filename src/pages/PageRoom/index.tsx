import { Box, List, ListItem } from "@mui/material";
import { Header } from "../../components/Header"
import { ChatRoomsClient } from "../../services/ChatRoomsClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "../../store";


const chatRoomsClient = new ChatRoomsClient();

export const PageRoom = () => {
    const { roomId } = useParams();
    const { userId, userName } = useSelector(({ userId, userName }) => ({ userId, userName }));

    const [room, setRoom] = useState<{ id: string, title: string, users: { id: string, userName: string }[] }>({ id: '', title: '', users: [] });

    console.log('PageRoom', room);
    useEffect(() => {
        if (!roomId || !userId || !userName)
            return;

        console.log('PageRoom useEffect');

        chatRoomsClient.initRoom(roomId, userId, userName, setRoom);
    }, [roomId, userId, userName]);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header />
            <List>
                {
                    room.users.map((user) => (
                        <ListItem key={user.id}>
                            {user.userName}
                        </ListItem>
                    ))
                }
            </List>
        </Box>)
};
