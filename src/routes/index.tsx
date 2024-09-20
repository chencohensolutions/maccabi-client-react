import { Routes, Route } from 'react-router-dom';

import { PageLogin, PageHome, PageUsers, PageRooms, PageRoom } from '../pages';

export const Navigator = () => (
	<Routes>
		<Route path="/login" element={<PageLogin />} />
		<Route path="/users" element={<PageUsers />} />
		<Route path="/rooms" element={<PageRooms />} />
		<Route path="/rooms/:roomId" element={<PageRoom />} />
		<Route path="/" element={<PageHome />} />
	</Routes>)
