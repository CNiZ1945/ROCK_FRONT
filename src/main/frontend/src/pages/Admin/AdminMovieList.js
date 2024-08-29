import React, {useState, useEffect, useCallback, useRef} from "react";
import { useNavigate } from 'react-router-dom';

import styled from "styled-components";
import Pagination from "react-js-pagination";
import axios from "axios";
import SideBar from "./SideBar";
import home from "./images/home.svg";
import CommonTable from './AdminTable/CommonTable';
import CommonTableColumn from './AdminTable/CommonTableColumn';
import CommonTableRow from './AdminTable/CommonTableRow';
import ChatBot from "../../components/ChatBot/ChatBot"


import "./css/Admin.css";
import "./css/AdminMovieList.css";
import "./css/Paging.css";
import { api } from "../../api/axios";




const AdminMovieList = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    // const [searchType, setSearchType] = useState("title");
    const [selectedMovies, setSelectedMovies] = useState([]);

    const navigate = useNavigate();

    //관리자 권한 인증 확인
    const initializedRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    const [sortOrder, setSortOrder] = useState('asc');


    const checkPermission = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        try {
            const response = await api.get('/auth/memberinfo', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            const role = response.data.memRole;
            if (role === 'ADMIN') {
                setHasPermission(true);
            } else {
                alert("권한이 없습니다.");
                navigate('/');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요.");
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;
            checkPermission();
        }
    }, [checkPermission]);


    const fetchMovies = useCallback(async (page = currentPage, term = searchTerm, order = sortOrder) => {
        try {
            const url = '/admin/movie/list/search';
            const params = {
                page: page - 1,
                size: 5,
                sort: `movieId,${order}`,
                searchTerm: term
            };

            const response = await api.get(url, { params });
            setMovies(response.data.content);
            setTotalItems(response.data.totalElements);
        } catch (error) {
            console.error("영화 데이터를 가져오는 데 실패했습니다:", error);
        }
    }, []);


    useEffect(() => {
        fetchMovies(currentPage, searchTerm, sortOrder);
    }, [fetchMovies, currentPage, searchTerm, sortOrder]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchMovies(1, searchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchMovies(pageNumber, searchTerm); //searchType 필요시
    };



    const handleAddMovie = () => navigate("/admin/MovieUpload");
    const handleEditMovie = (movieId) => navigate(`/admin/movie/${movieId}/modify`);
    const handleDeleteMovie = async () => {
        if (selectedMovies.length === 0) {
            alert("삭제할 영화를 선택해주세요.");
            return;
        }

        if (window.confirm("선택한 영화를 삭제하시겠습니까?")) {
            try {
                await api.delete('/admin/movie/delete', { data: selectedMovies });
                alert("선택한 영화가 삭제되었습니다.");
                setSelectedMovies([]);
                fetchMovies(currentPage);
            } catch (error) {
                console.error("영화 삭제에 실패했습니다:", error);
                alert("영화 삭제에 실패했습니다.");
            }
        }
    };

    const handleCheckboxChange = (movieId) => {
        setSelectedMovies(prev =>
            prev.includes(movieId)
                ? prev.filter(id => id !== movieId)
                : [...prev, movieId]
        );
    };

    const toggleSort = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        fetchMovies(currentPage, searchTerm, newOrder);
    };


    return (
        <div className="wrap">
            <SideBar />
            <div className="admin_head">
                <img src={home} alt="Home" />
                <h2>관리자페이지</h2>
            </div>
            <div className="admin_movie_head">
                <span>Admin {">"} 영화 관리</span>
            </div>
            <div className="wrap_Boby">
                <div className="list_div">
                    <FormBox onSubmit={handleSearch}>
                        <SearchInput
                            type="text"
                            placeholder="제목,장르,감독을 입력하세요."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button type="submit">검색</Button>
                    </FormBox>

                    <Header>
                        <h2>영화 관리</h2>
                        <button className="botom_write" onClick={handleAddMovie}>
                            <a>등록</a>
                        </button>
                        <button className="botom_delete" onClick={handleDeleteMovie}>
                            <a>삭제</a>
                        </button>
                    </Header>

                    <CommonTable headersName={[
                        '',
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleSort}>
                            영화 ID
                            <button style={{ marginLeft: '5px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                {sortOrder === 'asc' ? '▲' : '▼'}
                            </button>
                        </div>,
                        '영화 이름',
                        '영화 장르',
                        '영화 감독',
                        '영화 시간',
                        ''
                    ]}>
                        {movies.map((movie, index) => (
                            <CommonTableRow key={index}>
                                <CommonTableColumn>
                                    <input
                                        type="checkbox"
                                        checked={selectedMovies.includes(movie.movieId)}
                                        onChange={() => handleCheckboxChange(movie.movieId)}
                                    />
                                </CommonTableColumn>
                                <CommonTableColumn>{movie.movieId}</CommonTableColumn>
                                <CommonTableColumn>{movie.movieTitle}</CommonTableColumn>
                                <CommonTableColumn>{movie.genres.join(', ')}</CommonTableColumn>
                                <CommonTableColumn>{movie.directors.join(', ')}</CommonTableColumn>
                                <CommonTableColumn>{movie.runtime}</CommonTableColumn>
                                <CommonTableColumn>
                                    <EditButton onClick={() => handleEditMovie(movie.movieId)}>수정</EditButton>
                                </CommonTableColumn>
                            </CommonTableRow>
                        ))}
                    </CommonTable>

                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={5}
                        totalItemsCount={totalItems}
                        pageRangeDisplayed={5}
                        prevPageText={"‹"}
                        nextPageText={"›"}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

export default AdminMovieList;


// 검색창 전체 폼
const FormBox = styled.form`
    width: 1044px;
    display: flex;
`;

//Select
const Select = styled.select`
    width: 200px;
    outline: none;
    font-size: 16px;
    text-indent: 10px;
    color: #000;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
    margin-right: 20px;
`;

//옵션
const Option = styled.option`
    background-color: transparent;
    border: none;
`;


// 검색창 폼
const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 800px;
    margin-right: 20px;
    padding-left: 20px;
    border: none;
    outline: none;
    //caret-color: rgb(49, 130, 246);
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
`;

//검색 버튼
const Button = styled.button`
    width: 140px;
    height: 45px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    background-color: #e5e8eb;
    float: right;
    font-size: 14px;

    &:hover{
        background-color: #1351f9;
        color: #fff;
    }

`;


const Header = styled.div`
    font-family: 'SUIT-Regular' !important;
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 48px;
    padding-top: 74px;
    text-align: left;
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 48px;
    text-align: center;

    .name-notice {
        display: flex;
        justify-content: center;
    }
    //01.등록 버튼
    .botom_write{
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #3182f6;
        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;
        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }

    .botom_write a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;

        &:hover {
            cursor: pointer;
            color: #fff;
           font-weight: 600;
        }
    }
    //02.수정 버튼
    .botom_Edit{
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #ff27a3;
        margin-right: 20px;

        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;
        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }
    .botom_Edit a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;

        &:hover {
            cursor: pointer;
            color: #fff;
            font-weight: 600;
        }
    }

    //03.삭제 버튼
    .botom_delete{
        margin-right: 20px;
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: red;
        float: right;
        margin-top: 2px;
        position: relative;
        bottom: -10px;

        &:hover {
            cursor: pointer;
            //border: 2px solid rgb(51, 61, 75);
            background-color:  #3182f6;;
        }
    }

    .botom_delete a{
        font-size: 14px;
        color: #fff;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;
        color: #fff;

        &:hover {
            cursor: pointer;
            color: #fff;
            font-weight: 600;
        }
    }
`;

const CheckboxInput = styled.input`
    margin: 0;
    cursor: pointer;
`;

const EditButton = styled.button`
    padding: 5px 10px;
    background-color: #ff27a3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #e61e91;
    }
`;
