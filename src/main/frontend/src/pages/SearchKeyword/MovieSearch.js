import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import '../css/Header.css';
import ChatBot from '../ChatBot/ChatBot';
import { api } from '../../api/axios';
import styled from 'styled-components';
import Pagination from "react-js-pagination";

import search from "./images/search.svg"
import bullet from "./images/bullet.svg"
import searchimg from './images/searchimg.png'

function MovieSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [topRankMovies, setTopRankMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0'));
    const [totalPages, setTotalPages] = useState(1);
    const [currentGroup, setCurrentGroup] = useState(Math.floor(page / 10));
    const [searchInput, setSearchInput] = useState(""); // 검색 입력 상태 추가

    const navigate = useNavigate();
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams(searchParams.toString());
                queryParams.set('page', page);
                console.log('쿼리 파라미터:', queryParams.toString());
                const response = await api.get(`/user/MovieSearch?${queryParams.toString()}`);
                const data = response.data;
                console.log('응답 데이터:', data); // 응답 데이터 확인
                setMovies(Array.isArray(data.content) ? data.content : []);
                setTotalPages(data.totalPages || 1);
                console.log('업데이트된 movies 상태:', data.content); // 상태 설정 후 로그
            } catch (err) {
                if (err.response) {
                    console.error('서버 응답 에러:', err.response);
                    setError('검색 요청 실패');
                } else if (err.request) {
                    console.error('요청 에러:', err.request);
                    setError('서버 오류');
                } else {
                    console.error('일반 에러:', err.message);
                    setError('요청 중 오류 발생');
                }
            } finally {
                setLoading(false);
            }
        };


        fetchMovies();
    }, [searchParams, page]);

    useEffect(() => {
        const fetchTopRankMovies = async () => {
            try {
                const response = await api.get('/user/TopRankMovies');
                if (response.ok) {
                    const data = response.data;
                    console.log('상위 랭킹 영화 데이터:', data);
                    setTopRankMovies(Array.isArray(data.content) ? data.content : [data.content]);
                } else {
                    console.error("랭킹 정보 불러오는 중 에러 발생 error:", error);

                    setError('상위 랭킹 영화 요청 실패');
                }
            } catch (err) {
                console.error("fetchTopRankMovies error", err);

                setError('서버 오류');
            }
        };

        fetchTopRankMovies();
    }, []);

    useEffect(() => {
        setCurrentGroup(Math.floor(page / 10));
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage - 1);
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams.toString());
            newParams.set('page', newPage - 1);
            return newParams;
        });
    };

    const handleNextGroup = () => {
        const nextGroupStartPage = (currentGroup + 1) * 10;
        if (nextGroupStartPage < totalPages) {
            setCurrentGroup(currentGroup + 1);
            handlePageChange(nextGroupStartPage);
        }
    };

    const handlePrevGroup = () => {
        if (currentGroup > 0) {
            const prevGroupStartPage = (currentGroup - 1) * 10;
            setCurrentGroup(currentGroup - 1);
            handlePageChange(prevGroupStartPage);
        }
    };

    // pagination 버튼 기능 (지금 외부 라이브러리 Pagination 쓰고 있음)
    const renderPagination = () => {
        const maxPagesPerGroup = 10;
        const startPage = currentGroup * maxPagesPerGroup;
        const endPage = Math.min(startPage + maxPagesPerGroup, totalPages);
        const pageButtons = [];

        for (let i = startPage; i < endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    disabled={i === page}
                    onClick={() => handlePageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }

        return (
            <div className="pagination">
                {currentGroup > 0 && (
                    <button onClick={handlePrevGroup}>
                        {"<"}
                    </button>
                )}
                {pageButtons}
                {endPage < totalPages && (
                    <button onClick={handleNextGroup}>
                        {">"}
                    </button>
                )}
            </div>
        );
    };

    // html 시작 ================
    return (
        <>
            <div className="search">
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={searchInput} // 입력 필드에 상태 연결
                        onChange={(e) => setSearchInput(e.target.value)} // 입력값 변경 시 상태 업데이트
                        placeholder="검색 예: title:Inception, director:Nolan, actor:DiCaprio, genre:Sci-Fi"
                    />
                    <button type="submit" onClick={() => setSearchParams({ query: searchInput })}>
                        검색
                    </button>
                </form>
            </div>

            {loading && <p>검색 중...</p>}
            {error && <p className="error">{error}</p>}

            <div className="top_rank_movies">
                <h2>상위 랭킹 영화</h2>
                {topRankMovies.length > 0 ? (
                    <ul>
                        {topRankMovies.map((movie) => (
                            <li key={movie.movieId}>
                                <Link to={`/user/MoviePage/${movie.movieId}`}>
                                    {movie.movieTitle}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>상위 랭킹 영화가 없습니다.</p>
                )}
            </div>

            <ChatBot />




            {/* ============================================================== */}
            <Wrap>
                <MainContainer>

                    <WriteSection>
                        {/*검색창*/}
                        <Link><img src={search} alt="검색창"></img></Link>

                        <SearchInput
                            type="text"
                            className="bottom_search_text"
                            placeholder="무엇이든 찾아보세요"
                        // onChange={handleSearchInput}
                        />
                    </WriteSection>



                    <Container>
                        {/*포스터.01*/}
                        <SectionTop>영화</SectionTop>

                        <SectionR>
                            {/*버튼*/}
                            <button
                                className="button"
                                type="button"
                                onClick={() => {
                                    navigate(`/`);
                                }}
                            >
                                <img className="bullet" src={bullet}></img>
                                <a className="button">전체보기</a>
                                {/*<a>전체검색결과 돌아가기&nbsp;&nbsp;> </a>*/}
                            </button>
                        </SectionR>






                        {/*포스터 감싸는 박스*/}

                        <SectionContainer>
                            {movies.map((movie) => (
                                <>
                                    <SectionA>
                                        <Link key={movie.movieId} to={`/user/MoviePage/${movie.movieId}`}>
                                            <figure className="movie_figure">
                                                {movie.posters && movie.posters.length > 0 ? (
                                                    movie.posters.map((poster, index) => (
                                                        <img
                                                            key={index}
                                                            src={poster.posterUrls || 'https://via.placeholder.com/500x750?text=No+Image'}
                                                            alt={movie.movieTitle}
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <img
                                                        src='https://via.placeholder.com/500x750?text=No+Image'
                                                        alt={movie.movieTitle}
                                                    />
                                                )}
                                                <figcaption>{movie.movieTitle}</figcaption>
                                            </figure>
                                        </Link>
                                    </SectionA>


                                </>
                            ))}
                        </SectionContainer>
                    </Container>


                    {/*페이지네이션*/}
                    <Pagination
                        className="pagination"
                        activePage={page} // 현재 페이지
                        itemsCountPerPage={1} // 한 페이지랑 보여줄 아이템 갯수
                        totalItemsCount={10} // 총 아이템 갯수
                        pageRangeDisplayed={10} // paginator의 페이지 범위
                        prevPageText={"‹"} // "이전"을 나타낼 텍스트
                        nextPageText={"›"} // "다음"을 나타낼 텍스트
                        onChange={handlePageChange} // 페이지 변경을 핸들링하는 함수
                    />

                </MainContainer>
                <ChatBot />
            </Wrap>
        </>
    );
}

export default MovieSearch;


const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    //background-color: #fff !important;
`;

const MainContainer = styled.div`
    width: 1044px;
    margin: 0 auto;
`;

//컨테이너 전체 감싸는 박스
const Container = styled.div`
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 40px;
`;

// 검색창+글쓰기 버튼 감싸는 박스
const WriteSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 74px;
    margin: 0 auto;
    width: 1024px;
    border-bottom: 1px solid rgb(176, 184, 193);
    background-color: transparent;
    
    
    img{
        width: 26px;
        height: 26px;
        margin-bottom: 10px;
        margin-left: 20px;
        opacity: 0.5;
    }
`;

// 검색창
const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 1024px;
    padding-bottom: 16px;
    padding-left: 20px;
    border: none;
    outline: none;
    //caret-color: rgb(49, 130, 246);
    font-size: 18px;
    font-weight: 400;
    line-height: 130%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
`;


//01.타이틀: 에피소드
const SectionTop = styled.div`
  font-size: 22px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    margin-top: 140px;
`;

//오른쪽 더보기 버튼
const SectionR = styled.div`
    float: right;
    
    .button {
        font-size: 16px;
        line-height: 24px;
        color: #a5a5a5;
        padding: 5px 5px 5px 0;
        margin-bottom: 10px;
    }  
       
    .bullet{
        width: 20px;
        margin: 4px 10px;
    }
    
    &:hover{
        font-weight: 600;
        color: #fff;
        }
    
`;


//포스터 감싸는 전체 박스
const SectionContainer = styled.div`
    width: 1044px;
    
    //margin: 0 auto;
    //margin-top: 40px;
    //padding-bottom: 50px;
    display: flex;
    flex-direction: row;
    gap: 30px;

`;

//타이틀+이미지+하단내용= 감싸는 박스
const SectionA = styled.div`
    width: 240px;
    // overflow:hidden;

    
    span{
        overflow:hidden;
        width: 240px;
        padding-top: 20px;
        color: #a5a5a5;
        font-size: 14px;
        display: table-cell;
        vertical-align: top;
    }
    .movie_figure{
        width: 300px;

        }
        
        figcaption{
            font-size: 15px;
            overflow: wrap;
        }

        img{
        border: 1px solid red;
        width: 240px;
        height: 360px;
        border-radius: 12px;
        will-change: transform;
        background-color: #252525;
        overflow:hidden;
        
        //호버시,
        &:hover{
            width: 240px;
            height: 360px;
            border-radius: 12px;
            transform: scale(1.1);
            transition: all 0.2s linear;
            overflow:hidden;
            
        }
    }
`;


const SectionBottom = styled.div`
    width: 240px;
    color: #a5a5a5;
    font-size: 14px;
    display: table-cell;
    vertical-align: top;
`;



// ====================================================================================================
