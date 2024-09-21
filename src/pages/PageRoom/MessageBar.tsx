import { Button, TextField } from "@mui/material";
import styles from './PageRoom.module.scss';

interface MessageBarProps {
    message: string;
    setMessage: (message: string) => void;
    onSendMessage: () => void;
}    
export const MessageBar = ({message, setMessage, onSendMessage}: MessageBarProps) => {

    const onKeyUp = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSendMessage();
        }
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }
    return (<div className={styles.bottomBar}>
        <TextField autoComplete="off" name="message" value={message} className={styles.input} placeholder="Message" onChange={onChange} onKeyUp={onKeyUp}/>
        <Button className={styles.sendButton} disabled={message === ''} onClick={onSendMessage}>Send</Button>
    </div>)
}
