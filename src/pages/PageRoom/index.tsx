import { Header } from "../../components/Header"
import { ChatRoomsClient, IRoomMessage, IRoomUser } from "../../services/ChatRoomsClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "../../store";
import { MessageBar } from "./MessageBar";


import styles from './PageRoom.module.scss';
import { MessagesPanel } from "./MessagesPanel";

const chatRoomsClient = new ChatRoomsClient();

export const PageRoom = () => {
    const { roomId } = useParams();
    const { userId, userName, users } = useSelector(({ userId, userName, users }) => ({ userId, userName, users }))
    const [messages, setMessages] = useState<IRoomMessage[]>([]);
    const [message, setMessage] = useState('');
    const [room, setRoom] = useState<{ id: string, title: string, users: IRoomUser[] }>({ id: '', title: '', users: [] });

    console.log('PageRoom', room);



    useEffect(() => {
        if (!roomId || !userId || !userName)
            return;
        chatRoomsClient.joinRoom(roomId, userId, userName, setRoom, setMessages);
        return () => {
            chatRoomsClient.leaveRoom();
        }
    }, [roomId, userId, userName]);


    useEffect(() => {
        const messagesWrapper = document.querySelector(`.${styles.messagesScroll}`);
        if (messagesWrapper) {
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
        }
    }, [messages]);

    const onSendMessage = () => {
        if (!roomId || !userId || message === '')
            return;
        chatRoomsClient.sendMessage(message);
        setMessage('');
    };

    return (
        <div className={styles.root}>
            <Header room={room} />
            <div className={styles.userList}>
                {
                    room.users.map((user) => (
                        <div key={user.userId} className={styles.userItem}>{user.userName}</div>
                    ))
                }
            </div>
            <div className={styles.chat}>
                <MessagesPanel messages={messages} userId={userId} roomUsers={room.users} users={users} />
                <MessageBar message={message} setMessage={setMessage} onSendMessage={onSendMessage}/>
            </div>
        </div>)
};
