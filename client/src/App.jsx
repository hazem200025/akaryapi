import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, RequireAuth } from './routes/layout/layout';
import HomePage from './routes/homePage/homePage';
import ListPage from './routes/listPage/listPage';
import SinglePage from './routes/singlePage/singlePage';
import ProfilePage from './routes/profilePage/profilePage';
import Login from './routes/login/login';
import Register from './routes/register/register';
import ProfileUpdatePage from './routes/profileUpdatePage/profileUpdatePage';
import NewPostPage from './routes/newPostPage/newPostPage';
import UpdatePage from './routes/updatePage/updatePage';
import RequestPage from './routes/requestPage/RequestPage';
import DetailPage from './routes/detailpage/DetailPage';
import Term from './routes/term/term';
import Contactus from './routes/contactus/contactus';
import { listPageLoader, profilePageLoader, singlePageLoader, detailPageLoader } from './lib/loaders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/list" element={<ListPage />} loader={listPageLoader} />
          <Route path="/:id" element={<SinglePage />} loader={singlePageLoader} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/term" element={<Term />} />
          <Route path="/contactus" element={<Contactus />} />
        </Route>
        <Route path="/" element={<RequireAuth />}>
          <Route path="/requests" element={<RequestPage />} />
          <Route path="/requests/:id" element={<DetailPage />} loader={detailPageLoader} />
          <Route path="/profile" element={<ProfilePage />} loader={profilePageLoader} />
          <Route path="/profile/update" element={<ProfileUpdatePage />} />
          <Route path="/add" element={<NewPostPage />} />
          <Route path="/update/:id" element={<UpdatePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
