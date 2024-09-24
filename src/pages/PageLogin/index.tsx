import { useEffect, useState } from "react";

import styles from './login.module.scss';
import { TextField, Button, Alert, FormLabel, FormControl, FormGroup } from '@mui/material';
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
                <FormGroup sx={{ gap: '10px' }}>
                    <FormControl>
                        <FormLabel htmlFor="name">User Name</FormLabel>
                        <TextField
                            id="name"
                            type="text"
                            className={styles.formInput}
                            name={'userName'}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            id="password"
                            type="password"
                            className={styles.formInput}
                            name={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>
                </FormGroup>
                <FormControl>
                    <Button variant="contained" onClick={onLoginSubmitClick}>
                        Login
                    </Button>
                </FormControl>
                <FormControl>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}
                </FormControl>
            </div>
        </div>
    );
}