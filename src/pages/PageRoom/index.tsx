import { Avatar, Button, TextField } from "@mui/material";
import { Header } from "../../components/Header"
import { ChatRoomsClient, IRoomMessage, IRoomUser } from "../../services/ChatRoomsClient";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "../../store";
import styles from './PageRoom.module.scss';
import { IUserAssoc } from "../../services/api";

import DoneAllIcon from '@mui/icons-material/DoneAll';

const chatRoomsClient = new ChatRoomsClient();

interface MessageProps {
    message: IRoomMessage;
    userId: string | null;
    roomUsers: IRoomUser[];
    users: IUserAssoc | null;
}

const getAvatarLetters = (userName: string) => {
    return userName.split(' ').map((word) => word[0].toUpperCase()).join('');
};
const MessageBubble = ({ message, userId, roomUsers, users }: MessageProps) => {
    const isRead = () => {
        let count = 0;
        roomUsers.forEach((user) => {
            if (message.readTimestamp[user.userId]) {
                count++;
            }
        });
        return count === roomUsers.length && count > 1;
    }
    const isMyMessage = (message.userId === userId)
    const userName = users && users[message.userId];
    const text = message.message;
    const timestamp = new Date(message.timestamp).toLocaleTimeString();
    const getClassName = () => {
        let className = styles.message;
        if (isMyMessage) {
            className += ' ' + styles.myMessage;
        }
        if (isRead()) {
            className += ' ' + styles.isRead;
        }
        return className;
    };
    const avatarLetters = getAvatarLetters(userName || '');

    return (
        <div key={message.messageId} className={getClassName()}>
            <Avatar className={styles.avatar}>{avatarLetters}</Avatar>
            <div className={styles.bubble}>
                <div className={styles.userName}>
                    {userName}                </div>
                <div className={styles.text}>{text}</div>
                <div className={styles.info}>
                    <div className={styles.timestamp}>{timestamp}</div>
                    {isMyMessage && <div className={styles.messageRead}><DoneAllIcon /></div>}
                </div>
            </div>
        </div>
    );
};

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

    const onSendMessage = () => {
        if (!roomId || !userId || !userName || message === '')
            return;
        chatRoomsClient.sendMessage(message);
        setMessage('');
    };

    useEffect(() => {
        const messagesWrapper = document.querySelector(`.${styles.messagesScroll}`);
        if (messagesWrapper) {
            messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
        }
    }, [messages]);

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
                <div className={styles.messagesWrapper}>
                    <div className={styles.messagesScroll}>
                        <div className={styles.messages}>
                            {
                                messages.map((message) => (
                                    <MessageBubble key={message.messageId} message={message} userId={userId} roomUsers={room.users} users={users} />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className={styles.bottomBar}>
                    <TextField name="message" value={message} className={styles.input} placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
                    <Button className={styles.sendButton} disabled={message === ''} onClick={onSendMessage}>Send</Button>
                </div>
            </div>
        </div>)
};
