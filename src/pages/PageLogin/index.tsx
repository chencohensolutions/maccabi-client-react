import { useEffect, useState } from "react";

import styles from './login.module.scss';
import { TextField, Button, Alert } from '@mui/material';
import { ELoginState, loginPassword, useDispatch, useSelector } from "../../store";
import { useNavigate } from "react-router-dom";

export const PageLogin = () => {
    const dispatch = useDispatch();
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const loginState = useSelector(state => (state.loginState))

    useEffect(() => {
        if (loginState === ELoginState.success) {
            navigate('/', { replace: true });
        } else if (loginState === ELoginState.error) {
            setError('Invalid user name or password');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginState]);

    const onLoginSubmitClick = () => {
        setError('');
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
                <div className={styles.record}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}