import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { logout, useDispatch, useSelector } from "../store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';

export const Header = () => {
    const location = useLocation();
    const userName = useSelector((state) => state.userName);
    const navigate = useNavigate();

    const getPageTitle = () => {
        if (location.pathname === '/') {
            return 'Home';
        } else if (location.pathname === '/users') {
            return 'Users';
        } else if (location.pathname === '/rooms') {
            return 'Chat Rooms';
        };
    }

    const title = getPageTitle();

    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    useEffect(() => { }, [location.pathname]);

    const onLogoutClick = () => {
        dispatch(logout())
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {title}
            </Typography>
            <Box>{userName}</Box>
            <Button color="inherit" onClick={onLogoutClick}>Logout</Button>
        </Toolbar>
        <Drawer
            anchor={"left"}
            open={open}
            onClose={toggleDrawer(false)}>
            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                            navigate('/users')
                        }}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Users'} />
                        </ListItemButton >
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                            navigate('/rooms')
                        }}>
                            <ListItemIcon>
                                <ChatIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Chat Rooms'} />
                        </ListItemButton >
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    </AppBar>
};