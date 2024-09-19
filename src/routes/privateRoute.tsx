import { Navigate } from 'react-router-dom';


interface IPrivateRouteProps {
    children: JSX.Element;
    isAuth: boolean;
}


export const PrivateRoute = ({ children, isAuth }: IPrivateRouteProps) => {
    return isAuth ? children : <Navigate to="/login" />;
}