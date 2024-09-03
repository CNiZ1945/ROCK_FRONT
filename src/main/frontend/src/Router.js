// import React from 'react';
// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import Navs from './components/Nav/Navs';
// import Footer from './components/Footer/Footer';
// import Main from './pages/Main/Main';
// import Login from './pages/Login/Login';
// import SignUp from './pages/Login/SignUp';
// import ChangePassword from './pages/Login/ChangePassword';
// import FindIdPassword from './pages/Login/FindIdPassword';
// import NoticeList from "./pages/Notice/NoticeList";
// import NoticeView from "./pages/Notice/NoticeView";
// import NoticeWrite from "./pages/Notice/NoticeWrite";
// import MemberInfo from "./pages/Login/MemberInfo";
// import MyPage from "./pages/Login/Mypage/MyPage";
// import MovieSearch from './pages/SearchKeyword/MovieSearch';
// import AdminMovieList from './pages/Admin/AdminMovieList';
// import SearchKeyword from './pages/SearchKeyword/SearchKeyword';
// import AdminNoticeListPage from './pages/Admin/AdminNoticeListPage';
// import AdminMemberListPage from './pages/Admin/AdminMemberListPage';
// import MovieDetail from './pages/MovieDetail/MovieDetail';
// import MoviePlay from './pages/MovieDetail/MoviePlay';
// import AdminMovieUploadModifyPage from './pages/Admin/AdminMovieUploadModifyPage';
// import AdminMovieUploadFileModifyPage from './pages/Admin/AdminMovieUploadFileModifyPage';
// import AdminMovieUploadFilePage from './pages/Admin/AdminMovieUploadFilePage';
// import AdminMovieUploadPage from './pages/Admin/AdminMovieUploadPage';
// import Recommend from './pages/MovieDetail/Recommend';

// const AppRouter = () => {
//     const location = useLocation();

//     // 현재 경로에 따라 Navs 컴포넌트를 숨김
//     const hideNavs = location.pathname === '/Login' || location.pathname === '/SignUp' || location.pathname === '/FindIdPassword';

//     return (
//         <>
//             {!hideNavs && <Navs />}
//             <Routes>
//                 <Route path="/" element={<Main />} />
//                 <Route path="/user/SearchKeyword" element={<SearchKeyword />} />
//                 <Route path="/user/MovieSearch" element={<MovieSearch />} />
//                 <Route path="/user/ChangePassword" element={<ChangePassword />} />
//                 <Route path="/FindIdPassword" element={<FindIdPassword />} />
//                 <Route path="/Login" element={<Login />} />
//                 <Route path="/SignUp" element={<SignUp />} />
//                 <Route path='/user/Mypage' element={<MyPage />} />
//                 <Route path='/user/MemberInfo' element={<MemberInfo />} />
//                 <Route path="/user/Recommend" element={<Recommend />} />
//                 <Route path='/user/MoviePage/:movieId' element={<MovieDetail />} />
//                 <Route path="/user/MoviePlay/:movieId" element={<MoviePlay />} />
//                 <Route path='/user/Notice' element={<NoticeList />} />
//                 <Route path='/user/Notice/:boardId' element={<NoticeView />} />
//                 <Route path='/admin/Notice/Write' element={<NoticeWrite />} />
//                 <Route path="/admin/MovieList" element={<AdminMovieList />} />
//                 <Route path="/admin/MovieUpload" element={<AdminMovieUploadPage />} />
//                 <Route path="/admin/Movie/:movieId/Modify" element={<AdminMovieUploadModifyPage />} />
//                 <Route path="/admin/MovieUploadFile" element={<AdminMovieUploadFilePage />} />
//                 <Route path="/admin/Movie/:movieId/Modify2" element={<AdminMovieUploadFileModifyPage />} />
//                 <Route path="/admin/MemberList" element={<AdminMemberListPage />} />
//                 <Route path="/admin/Notice" element={<AdminNoticeListPage />} />
//                 <Route path="*" element={<div>찾으시는 창이 없네요</div>} />
//             </Routes>
//             <Footer />
//         </>
//     );
// };

// const Router = () => {
//     return (
//         <BrowserRouter>
//             <AppRouter />
//         </BrowserRouter>
//     );
// };

// export default Router;



// =====================================================================================================================================

// Router.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Layout 컴포넌트 임포트
import Main from './pages/Main/Main';
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
// import GoogleAPI from './pages/Login//users/login';
// import WithdrawMember from './pages/Login/WithdrawMember';

import ChangePassword from './pages/Login/ChangePassword';
import FindIdPassword from './pages/Login/FindIdPassword';

import NoticeList from "./pages/Notice/NoticeList";
import NoticeView from "./pages/Notice/NoticeView";
import NoticeWrite from "./pages/Notice/NoticeWrite";
import MemberInfo from "./pages/Login/MemberInfo";
import Mypage from "./pages/Login/Mypage/MyPage";
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

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 로그인/회원가입 페이지 (네비게이션 바 없음) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/findIdPassword" element={<FindIdPassword />} />

                {/* 네비게이션 바가 포함된 페이지 */}
                <Route path="/" element={<Layout><Main /></Layout>} />
                {/* 나머지 경로에 대해서도 동일하게 설정 */}
                <Route path="/user/searchKeyword" element={<Layout><SearchKeyword /></Layout>} />
                <Route path="/user/MovieSearch" element={<Layout><MovieSearch /></Layout>} />
                <Route path="/user/changePassword" element={<Layout><ChangePassword /></Layout>} />
                <Route path='/user/mypage' element={<Layout><Mypage /></Layout>} />
                <Route path='/user/memberinfo' element={<Layout><MemberInfo /></Layout>} />
                <Route path="/user/Recommend" element={<Layout><Recommend /></Layout>} />
                <Route path='/user/moviepage/:movieId' element={<Layout><MovieDetail /></Layout>} />
                <Route path="/user/MoviePlay/:movieId" element={<Layout><MoviePlay /></Layout>} />
                <Route path='/user/notice' element={<Layout><NoticeList /></Layout>} />
                <Route path='/user/notice/:boardId' element={<Layout><NoticeView /></Layout>} />
                <Route path='/admin/notice/write' element={<Layout><NoticeWrite /></Layout>} />
                <Route path="/admin/movieList" element={<Layout><AdminMovieList /></Layout>} />
                <Route path="/admin/movieUpload" element={<Layout><AdminMovieUploadPage /></Layout>} />
                <Route path="/admin/movie/:movieId/modify" element={<Layout><AdminMovieUploadModifyPage /></Layout>} />
                <Route path="/admin/movieUploadFile" element={<Layout><AdminMovieUploadFilePage /></Layout>} />
                <Route path="/admin/movie/:movieId/modify2" element={<Layout><AdminMovieUploadFileModifyPage /></Layout>} />
                <Route path="/admin/memberList" element={<Layout><AdminMemberListPage /></Layout>} />
                <Route path="/admin/notice" element={<Layout><AdminNoticeListPage /></Layout>} />

                {/* 404 페이지 */}
                <Route path="*" element={<Layout><div>찾으시는 창이 없네요</div></Layout>} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
