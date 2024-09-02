import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navs from './components/Nav/Navs';
import Footer from './components/Footer/Footer';
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import ChangePassword from './pages/Login/ChangePassword';
import FindIdPassword from './pages/Login/FindIdPassword';
import NoticeList from "./pages/Notice/NoticeList";
import NoticeView from "./pages/Notice/NoticeView";
import NoticeWrite from "./pages/Notice/NoticeWrite";
import MemberInfo from "./pages/Login/MemberInfo";
import MyPage from "./pages/Login/Mypage/MyPage";
import MovieSearch from './pages/SearchKeyword/MovieSearch';
import AdminMovieList from './pages/Admin/AdminMovieList';
import SearchKeyword from './pages/SearchKeyword/SearchKeyword';
import AdminNoticeListPage from './pages/Admin/AdminNoticeListPage';
import AdminMemberListPage from './pages/Admin/AdminMemberListPage';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import MoviePlay from './pages/MovieDetail/MoviePlay';
import AdminMovieUploadModifyPage from './pages/Admin/AdminMovieUploadModifyPage';
import AdminMovieUploadFileModifyPage from './pages/Admin/AdminMovieUploadFileModifyPage';
import AdminMovieUploadFilePage from './pages/Admin/AdminMovieUploadFilePage';
import AdminMovieUploadPage from './pages/Admin/AdminMovieUploadPage';
import Recommend from './pages/MovieDetail/Recommend';

const AppRouter = () => {
    const location = useLocation();

    // 현재 경로에 따라 Navs 컴포넌트를 숨김
    const hideNavs = location.pathname === '/login' || location.pathname === '/signUp' || location.pathname === '/findIdPassword';

    return (
        <>
            {!hideNavs && <Navs />}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/user/searchKeyword" element={<SearchKeyword />} />
                <Route path="/user/MovieSearch" element={<MovieSearch />} />
                <Route path="/user/changePassword" element={<ChangePassword />} />
                <Route path="/findIdPassword" element={<FindIdPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path='/user/mypage' element={<MyPage />} />
                <Route path='/user/memberinfo' element={<MemberInfo />} />
                <Route path="/user/Recommend" element={<Recommend />} />
                <Route path='/user/moviepage/:movieId' element={<MovieDetail />} />
                <Route path="/user/MoviePlay/:movieId" element={<MoviePlay />} />
                <Route path='/user/notice' element={<NoticeList />} />
                <Route path='/user/notice/:boardId' element={<NoticeView />} />
                <Route path='/admin/notice/write' element={<NoticeWrite />} />
                <Route path="/admin/movieList" element={<AdminMovieList />} />
                <Route path="/admin/movieUpload" element={<AdminMovieUploadPage />} />
                <Route path="/admin/movie/:movieId/modify" element={<AdminMovieUploadModifyPage />} />
                <Route path="/admin/movieUploadFile" element={<AdminMovieUploadFilePage />} />
                <Route path="/admin/movie/:movieId/modify2" element={<AdminMovieUploadFileModifyPage />} />
                <Route path="/admin/memberList" element={<AdminMemberListPage />} />
                <Route path="/admin/notice" element={<AdminNoticeListPage />} />
                <Route path="*" element={<div>찾으시는 창이 없네요</div>} />
            </Routes>
            <Footer />
        </>
    );
};

const Router = () => {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
};

export default Router;
