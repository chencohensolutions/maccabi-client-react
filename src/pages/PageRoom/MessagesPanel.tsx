

import { Avatar } from '@mui/material';
import { IUserAssoc } from '../../services/api';
import { IRoomMessage, IRoomUser } from '../../services/ChatRoomsClient';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import styles from './PageRoom.module.scss';

interface MessageBubbleProps {
    message: IRoomMessage;
    userId: string | null;
    roomUsers: IRoomUser[];
    users: IUserAssoc | null;
}

const getAvatarLetters = (userName: string) => {
    return userName.split(' ').map((word) => word[0].toUpperCase()).join('');
};

const MessageBubble = ({ message, userId, roomUsers, users }: MessageBubbleProps) => {
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

interface MessagesPanelProps {
    messages: IRoomMessage[];
    userId: string | null;
    roomUsers: IRoomUser[];
    users: IUserAssoc | null;
};

export const MessagesPanel = ({ messages, userId, roomUsers, users }: MessagesPanelProps) => {
    return (
        <div className={styles.messagesWrapper}>
            <div className={styles.messagesScroll}>
                <div className={styles.messages}>
                    {
                        messages.map((message) => (
                            <MessageBubble key={message.messageId} message={message} userId={userId} roomUsers={roomUsers} users={users} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}