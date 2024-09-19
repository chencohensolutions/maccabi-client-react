import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { Provider,  } from 'react-redux';
import { reduxStore,  useSelector, useDispatch } from './store';
import { Navigator } from './routes';
import { loginToken } from './store/session';





const App = () => {
  const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const tokenExpired = useSelector((state) => state.tokenExpired)

	useEffect(() => {
		if (tokenExpired && !(location.pathname === '/login' || location.pathname === '/signup')) {
			navigate('/login');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname, tokenExpired]);

	useEffect(() => {
		dispatch(loginToken())
	});
  
	return (
		<div id="page-wrapper" >
			<Navigator />
		</div>
	);
};

const AppWrapper = () => {
	return (
		<BrowserRouter>
			<Provider store={reduxStore}>
				<App />
			</Provider>
		</BrowserRouter>)
}

export default AppWrapper;
