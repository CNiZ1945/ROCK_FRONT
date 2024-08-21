import React, { useState } from 'react';
import styled from 'styled-components';
import CharmingGraph from './CharmingGraph';
import {Link} from "react-router-dom";
import search from "../SearchKeyword/images/search.svg";
import bullet from "../SearchKeyword/images/bullet.svg";
import searchimg from "../SearchKeyword/images/searchimg.png";
import {useNavigate} from 'react-router-dom';
// import Swiper from "../Main/Swiper/Swiper";
import MainTop4 from "../Main/MainTop4";
import PosterSwiper from '../Main/Swiper/PosterSwiper';


//Recommend -----------------------------
const Recommend = () => {

    //변수



    //★페이지네이션 ---------------------------
    // const [page, setPage] = useState(1);
    //
    // const handlePageChange = (page) => {
    //     setPage(page);
    // };

    //★네비 ---------------------------
    const navigate = useNavigate();

    //HTML
    return (<>
            {/*그래프 자리*/}
            <Wrap>
                <CharmingGraph/>
            </Wrap>

            {/*추천 자리*/}
            <RecommendConstainer>
                <RecommendContainer>

                    {/*1.타이틀*/}
                    <SectionANav>
                        회원님을 위한 추천 콘텐츠
                    </SectionANav>

                    {/*2.박스*/}
                    <Container>
                        <SectionA>
                            <PosterSwiper className="Swiper"/>
                       </SectionA>
                    </Container>


                {/*2.타이틀*/}
                <SectionANav>
                    회원님을 위한 추천 콘텐츠
                </SectionANav>

                {/*2.박스*/}
                <Container>
                    <SectionA>
                        <PosterSwiper className="Swiper"/>
                    </SectionA>
                </Container>

                    {/*<SectionR>*/}
                    {/*    /!*버튼*!/*/}
                    {/*    <button*/}
                    {/*        className="button"*/}
                    {/*        type="button"*/}
                    {/*        onClick={() => {*/}
                    {/*            navigate(`/`);*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <img className="bullet" src={bullet}></img>*/}
                    {/*        <a className="button">전체보기</a>*/}
                    {/*        /!*<a>전체검색결과 돌아가기&nbsp;&nbsp;> </a>*!/*/}
                    {/*    </button>*/}
                    {/*</SectionR>*/}

                    {/*포스터 감싸는 박스*/}
                    {/*<SectionContainer>*/}
                    {/*    <SectionA>*/}
                    {/*        <img src={searchimg}></img>*/}
                    {/*        <span>[극장판] 짱구는 못말려 23기</span>*/}
                    {/*    </SectionA>*/}
                    {/*    <SectionA>*/}
                    {/*        <img src={searchimg}></img>*/}
                    {/*        <span>[극장판] 짱구는 못말려 23기</span>*/}
                    {/*    </SectionA>*/}
                    {/*    <SectionA>*/}
                    {/*        <img src={searchimg}></img>*/}
                    {/*        <span>[극장판] 짱구는 못말려 23기</span>*/}
                    {/*    </SectionA>*/}
                    {/*    <SectionA>*/}
                    {/*        <img src={searchimg}></img>*/}
                    {/*        <span>[극장판] 짱구는 못말려 23기</span>*/}
                    {/*    </SectionA>*/}
                    {/*</SectionContainer>*/}
                </RecommendContainer>
            </RecommendConstainer>
        </>
    );
};
export default Recommend;


//A.그래프 박스 스타일 -----------------------------------
//0. Wrap - CharmingGraph 그래프 전체 박스
const Wrap = styled.div`
    width: 100%;
    height: 500px;
    margin: 0 auto;
    margin-top: 80px;
    padding-top: 40px;
    margin-bottom: 40px;
    border-radius: 12px;
    background-color:#fff;
   
`;

//B.바디 -----------------------------------
//1.추천 바디 박스
const RecommendConstainer = styled.div`
    width: 100%;
    margin: 0 auto;
    //background-color: rgb(11, 11, 13) !important;
    //border: 1px solid rgb(25, 31, 40);
    margin-bottom: 40px;
    border-radius: 12px;
`;

//2.타이틀 박스
const SectionANav = styled.div`
    font-family: 'SUIT-Regular';
    font-size: 22px;
    line-height: 36px;
    color: #fff;
    font-weight: 400;
    text-align: left;
    
    margin-top: 40px;
    margin-bottom: 40px;
    margin-left: 3rem;
    z-index: 1;
    padding-top: 5rem;
    
`;


const RecommendContainer = styled.div`
    width: 100%;
    margin: 0 auto;
`;


//3.바디 감싸는 박스
const Container = styled.div`
    width: 1044px;
    margin: 0 auto;
    margin-bottom: 40px;

    padding-top: 40px;
    padding-bottom: 40px;
    background-color: red;
`;

//4.이미지 감싸는 박스
const SectionA = styled.div`
    width: 1044px;
    margin: 0 auto;
    position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    margin-top: 2rem;
`;





//C.그래프 데이터 -----------------------------------
//그래프1
const CHARMING_DATA_LIST = [
    { id: 1, title: '감독연출' },
    { id: 2, title: '스토리' },
    { id: 3, title: '영상미' },
    { id: 4, title: '배우연기' },
    { id: 5, title: 'OST' },
];
//그래프2
const EMOTIOMAL_DATA_LIST = [
    { id: 1, title: '스트레스 해소' },
    { id: 2, title: '무서움' },
    { id: 3, title: '현실감' },
    { id: 4, title: '몰입감' },
    { id: 5, title: '긴장감' },
];
