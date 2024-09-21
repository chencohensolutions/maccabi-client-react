import { AppBar, Link, Box, Breadcrumbs, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { logout, useDispatch, useSelector } from "../store";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import { IRoom } from "../services/ChatRoomsClient";

interface PropsHeader {
    room?: IRoom;
}

interface IBreadcrumbsItem {
    label: string;
    link: string | null;
}
export const Header = ({ room }: PropsHeader) => {
    const location = useLocation();
    const userName = useSelector((state) => state.userName);
    const navigate = useNavigate();

    const breadcrumbsList = useMemo(() => {
        const path = location.pathname.split('/');

        const list = [{
            label: 'Home',
            link: '/'
        }] as IBreadcrumbsItem[];

        if (room) {
            list.push({
                label: 'Rooms',
                link: '/rooms'
            });
            list.push({
                label: room.title,
                link: null
            });
            return list;
        }
        if (path[1] && path[1] === 'users') {
            list.push({
                label: "Users",
                link: null
            });
            return list
        }

        if (path[1] && path[1] === 'rooms') {
            list.push({
                label: "Rooms",
                link: null
            });
            return list
        }
        return list;
    }, [location.pathname, room]);


    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);


    const onLogoutClick = () => {
        dispatch(logout())
    };

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return <AppBar position="static" sx={{backgroundColor: "#515151", flex: "none"}}>
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
            <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1, color: "white" }} >
                {breadcrumbsList.map((item, index) => (
                    (index === breadcrumbsList.length - 1) ?
                        <Typography key={index} sx={{ color: 'white' }}>{item.label}</Typography>
                        :
                        <Link color="#DDDDDD" key={index} underline="hover"  onClick={() => {
                            if (item.link) {
                                navigate(item.link)
                            }
                        }}>
                            {item.label}
                        </Link>

                ))}
            </Breadcrumbs>
            <Button color="inherit" onClick={onLogoutClick}>Logout {userName}</Button>
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