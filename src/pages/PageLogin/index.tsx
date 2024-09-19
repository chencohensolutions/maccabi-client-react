import { useState } from "react";

import styles from './login.module.scss';
import { TextField, Button } from '@mui/material';
import { loginPassword, useDispatch } from "../../store";

export const PageLogin = () => {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const onLoginSubmitClick = () => {
        dispatch(loginPassword({ userName, password }))
    };
    return (
        <div id="page-login" className={styles.container}>
            <div className={styles.loginTitle}>
                Sign In
            </div>
            <div className={styles.inputsContainer}>
                <div className={styles.record}>
                    <label htmlFor="name">
                        User Name
                    </label>
                    <TextField
                        id="name"
                        type="text"
                        className={styles.formInput}
                        placeholder={'User Name'}
                        name={'userName'}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className={styles.record}>
                    <label htmlFor="password">
                        Password
                    </label>
                    <TextField
                        id="password"
                        type="password"
                        className={styles.formInput}
                        placeholder={'password'}
                        name={'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.record}>
                    <Button variant="contained" onClick={onLoginSubmitClick}>
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}