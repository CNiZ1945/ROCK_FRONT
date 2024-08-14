import React, {useState, useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import CommonTable from '../../components/table/CommonTable';
import CommonTableColumn from '../../components/table/CommonTableColumn';
import CommonTableRow from '../../components/table/CommonTableRow';
import {postList} from '../../Data';
import styled from "styled-components";
import Pagination from "react-js-pagination";
import './css/Paging.css';
import search from "./images/search.svg"
import { api } from '../../api/axios';


//일반 회원 공지사항(게시판) 리스트
const NoticeList = ({postsPerPage, totalPosts, paginate}) => {
    
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [role, setRole] = useState(null);
    const initializedRef = useRef(false);

    // pagenation useState
    const [page, setPage] = useState(1);


    const checkPermission = async () => {
        try {
            const token = localStorage.getItem('accessToken')
            if(!token){
                alert('로그인이 필요한 페이지입니다.');
                navigate("/login");
                return;
            }
            else{
                setHasPermission(true);
            }    
        } 
        catch (error) {
            console.error('PostList user info error:', error);
            alert("오류가 발생했습니다. 다시 로그인해주세요")
            navigate('/login');
        }
        finally{
            setIsLoading(false);
        }
        
    }

    const loadBoardList = async (page = 0) => {
        try {
            const response = await api.get('/user/boardList', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                params: {
                    page, size: 10, sort: 'boardId,DESC'
                }
            });

            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(page);

        } 
        catch (error) {
            console.error('Error fetching board:', error);
            alert('목록을 불러오는 중 오류가 발생했습니다.')
            navigate(-1);
        }
    };

    const searchBoards = async () => {
        if(!searchKeyword.trim()) {
            loadBoardList(0);
            return;
        }
        try {
            const response = await api.get('/user/boardSearch',  {
                params: {
                    page: 0,
                    size: 10,
                    sort: 'boardId,DESC',
                    boardTitle: searchKeyword,
                    boardContent: searchKeyword,
                }
            });
            
            setBoardList(response.data.content);
            setTotalPages(response.data.totalPages);
            setCurrentPage(0);
        } 
        catch (error) {
            console.error('Error searching board:', error);
            alert('검색 중 오류가 발생했습니다.');
            navigate(-1);
        }
    };

    const getUserRole = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if(!token){
                throw new Error("No access Token found");
            }  
            const response = await api.get('/auth/memberinfo', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.memRole;  
        } 

        catch (error) {
            console.error('Error fetching member role:', error);
            return null;
            
        }

    }
    

    useEffect(() => {
        if(!initializedRef.current){
            initializedRef.current = true;
            checkPermission();
        }
        loadBoardList();
        getUserRole().then(role => setRole(role));
    }, []);


    if(isLoading){
        return(
            <div>
                Loading ...
            </div>
        );
    }

    if(!hasPermission){
        return null;
    }
    // =============================================================================
    //검색---------------------------
    // const handleSearchInput = e => setSearchInput(e.target.value);
    // const [searchInput,setSearchInput] = useState('');

    // useEffect(() => {
    //     window.addEventListener('click', function (e) {
    //         if (e.target.contains !== searchWrapper) {
    //             setSearchInput('');
    //         }
    //     });
    // }, []);


    //페이지네이션 ---------------------------

    const handlePageChange = (page) => {
        setPage(page);
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }


    //★연습용 Data.js ---------------------------
    // const [dataList, setDataList] = useState([]);

    // useEffect(() => {
    //     setDataList(postList);
    // }, [])



    return (

        <Wrap>
            <WriteSection>
                {/*검색창*/}
                <Link><img src={search} alt="검색창"></img></Link>

                <SearchInput
                    type="text"
                    className="bottom_search_text"
                    placeholder="무엇이든 찾아보세요"
                    onChange={e => setSearchKeyword(e.target.value)}
                />

                {/* 버튼 */}
                {/* <SearchButton */}
                {/*    type="button"*/}
                {/*    className="search_icon"*/}
                {/*    onClick=""*/}
                {/*    onChange=""*/}
                {/*>*/}
                {/*    <i className="fas fa-search"></i>*/}
                {/*</SearchButton>*/}

            </WriteSection>


            <Header>
                공지사항


                {/* <!-- 글쓰기 버튼 --> */}
                {role === 'ADMIN' && (
                    <button
                        className="botom_write"
                        type="button"
                        onClick={() => {
                            navigate(`/admin/notice/write`);
                        }}
                    >
                        <NoticeWriteButton>글쓰기</NoticeWriteButton>
                    </button>
                )}

            </Header>




            <div className="step-bar">
                <span className="gradation-blue"></span>
            </div>
            
            <CommonTable headersName={['글번호', '제목', '등록일', '조회수']}>
                {boardList ? boardList.map((item, index) => {
                    return (<CommonTableRow key={index}>
                        <CommonTableColumn>{index + 1}</CommonTableColumn>
                        <CommonTableColumn>
                            <Link to={`/noticeView/${item.boardId}`}>{item.boardTitle}</Link>
                        </CommonTableColumn>
                        <CommonTableColumn>{item.boardModifyDate}</CommonTableColumn>
                        <CommonTableColumn>{item.boardViewCount}</CommonTableColumn>
                    </CommonTableRow>)
                }) : '공지글이 없습니다'}
            </CommonTable>


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

        </Wrap>);
};
export default NoticeList;







// STYLE ------------------------------
// 검색창+글쓰기 버튼 감싸는 박스
const WriteSection = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 74px;
    margin: 0 auto;
    width: 1024px;
    border-bottom: 1px solid rgb(176, 184, 193);
    
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
`;



const Header = styled.div`
    font-family: 'SUIT-Regular' !important;
    color: rgb(51, 61, 75);
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 48px;
    padding-top: 74px;
    text-align: left;
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 48px;

    .name-notice {
        display: flex;
        justify-content: center;
    }
    //글쓰기 버튼
    .botom_write{
        width: 90px;
        height: 45px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: #e5e8eb;

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
        color: #0f2027;
        //padding: 10px 25px;
        text-align: center;
        display: flex;
        justify-content: center;
        cursor: pointer;
        color: rgb(51, 61, 75);

        &:hover {
            cursor: pointer;
            color: #fff;
           font-weight: 600;
        }
    }
`;

const NoticeWriteButton = styled.div`
    font-size: 15px;
`;

const Wrap = styled.div`
    width: 100%;
    //height: 100vh;
    position: relative;
    margin: 0 auto;
    //padding: 40px 40px;
    //background: rgb(255,255,255);
    background: #fff;
    display: inline-block;
`;


//푸터 전체 - 위치/배경
// const FooterTag = styled.footer`
//     color: #6b7684;
//     display: flex;
//     align-items: center;
//     flex-direction: column;
//     margin-left: auto;
//     margin-right: auto;
//     padding: 26px 0;
//     text-align: center;
//     bottom: 0;
//     width: 100%;
//     z-index: 9999999 !important;;
//     background-color: rgb(11, 11, 13) !important;
//     border-top: 1px solid rgb(25, 31, 40);
// `;