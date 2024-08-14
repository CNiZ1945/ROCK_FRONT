import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Navs from './components/Nav/Navs';
import Footer from './components/Footer/Footer';
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
import MyPage from "./pages/Login/Mypage/MyPage";
import Chart from './pages/Chart/Chart';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import AdminApp from './pages/Admin/AdminApp';
import AdminMovieList from './pages/Admin/AdminMovieList';
import SearchKeyword from './pages/SearchKeyword/SearchKeyword';
import AdminNoticeListPage from './pages/Admin/AdminNoticeListPage';


//Router
const Router = () => {
    return (<BrowserRouter>
            <Navs/>
        {/*Routes*/}
            <Routes>
                {/*메인*/}
                <Route index path="/" element={<Main/>}/>
                {/*<Route path="/users/login" element={<GoogleAPI />} />*/}

                {/*검색 결과*/}
                <Route path="/searchKeyword" element={<SearchKeyword/>}/>



                {/*로그인/회원가입*/}
                <Route path="/login" element={<Login/>}/>
                <Route path="/signUp" element={<SignUp/>}/>
                <Route path="/user/changePassword" element={<ChangePassword/>}/>
                <Route path="/findIdPassword" element={<FindIdPassword/>}/>
                {/*<Route path="/user/withdrawMember" element={<WithdrawMember/>}/>*/}


                {/*마이페이지 - 회원탈퇴/회원정보수정 */}
                <Route path='/user/mypage' element={<MyPage/>}/>
                <Route path='/user/memberinfo' element={<MemberInfo/>}/>


                {/*영화 - 상세페이지*/}
                <Route path="/chart" element={<Chart/>}/>
                <Route path='/user/moviepage/:movieId' element={<MovieDetail/>}/>
                <Route path='/chart/detail/:id' element={<MovieDetail/>}/>



                {/*공지사항*/}
                <Route path='/user/notice' element={<NoticeList/>}/>
                <Route path='/user/notice/:boardId' element={<NoticeView/>}/>
                <Route path='/admin/notice/write' element={<NoticeWrite/>}/>


                {/*관리자*/}
                {/* <Route path="/admin" element={<AdminApp/>}/> */}
                <Route path="/admin/movieList" element={<AdminMovieList/>}/>
                {/*<Route path="/admin/movieUpload" element={<AdminMovieUpload/>}/>*/}
                {/*<Route path="/admin/movie/:movieId/modify" element={<AdminMovieUploadModify/>}/>*/}
                {/*<Route path="/admin/movieUploadFile" element={<AdminMovieUploadFile/>} />*/}
                {/*<Route path="/admin/movie/:movieId/modify2" element={<AdminMovieUploadFileModify/>} />*/}
                {/*<Route path="/admin/memberList" element={<AdminMemberList/>} />*/}
                <Route path="/admin/notice" element={<AdminNoticeListPage />}/>


                {/* 결제하기*/}
                {/*<Route path="/seats" elememt={<Seats />} />*/}
                {/*<Route path="/selectmovie" element={<SelectMovie />} />*/}
                {/*<Route path="/payment" element={<Payment />} />*/}
                {/*<Route path="/payment/approval" element={<PaymentApproval />} />*/}
                {/*<Route path="/payment/cancel" element={<PaymentCancel />} />*/}
                {/*<Route path="/payment/fail" element={<PaymentFail />} />*/}
                {/*<Route path="/payment/result" element={<PaymentResult />} />*/}
                {/*<Route path="/theater" element={<Theater />} />*/}
                <Route path="*" element={<div>찾으시는 창이 없네요</div>}/>
            </Routes>
        {/*/Routes*/}
            <Footer/>
        </BrowserRouter>);
};
export default Router;
