import { Routes, Route } from 'react-router-dom';

import { PageLogin, PageHome } from '../pages';


export const Navigator = () => (
	<Routes>
		<Route path="/login" element={<PageLogin />} />
		<Route path="/" element={<PageHome />} />

		{/* <Route path="*" element={<p>Page Not Founde: 404!</p>} /> */}
	</Routes>)
