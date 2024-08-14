import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useParams, useNavigate} from 'react-router-dom';


import DetailImg from './MovieDetailVideoImage/DetailImg';
import poster from './images/poster.jpg'
import like from './images/like.svg'
import likes from './images/likes.svg'
import share from './images/share.svg'

import MoviePlay from './MoviePlay';

import MovieInformation from './MovieInformation'
import CharmingGraph from './CharmingGraph';
import MovieReview from './MovieReview';
import MovieTab from './MovieTab.js'


//MovieDetail --------------------------
const MovieDetail = () => {

//탭 폼-----------------
    const [currentTab, setTab] = useState(0);

    const menuArr = [
        {name: '상세정보', content: <MovieInformation />},
        {name: '예고편', content: <MoviePlay />},
        {name: '리뷰', content: <MovieReview />},
        {name: '추천', content: ""},
        // {name: '추천', content: <MovieReview />},
    ];
    const selectMenuHandler = (index: any) => {
        setTab(index);
    };




//영화 상세페이지 내용-----------------
    const [movieData, setMovieData] = useState({});
    const [scrollPosition, setScrollPosition] = useState(0);
    const [toggleBtn, setToggleBtn] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    const {
        movieThumbNailImg,
        movieName,
        movieNameInEnligh,
        director,
        movieActors,
        // country,
        movieAgeRating,
        movieRunningTime,
        movieGenre,
        movieOpeningDate,
        movieDetailDescription,
        movieStillCut,
        movieTrailer,
    } = movieData;

    const stillCutList = movieData.movieStillCut;

    const handleScroll = () => {
        const {scrollY} = window;
        scrollY > 200 && setToggleBtn(!toggleBtn);
    };

    const goToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setToggleBtn(false);
    };

    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    //백엔드 서버
    useEffect(() => {
        fetch(`/movies/detail?movieId=${params.id}`, {
            // fetch(`http://43.200.63.91:3000/movies/detail?movieId=${params.id}`, {
            method: 'GET', headers: {'Content-Type': 'application/json;charset=utf-8'},
        })
            .then(response => response.json())
            .then(data => {
                setMovieData(data.getMovieDetail[0]);
            });

        window.addEventListener('scroll', updateScroll);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    //html  ---------------------------------------------------
    return (<Div>
        {movieData && (<div>
            <WholeContainer>

                <MovieBox>
                    <Box>

                        <RightBox>
                            <MovieAndDetail>
                                <AsidePoster>
                                    {/*제목*/}
                                    <MovieTitle>조커</MovieTitle>
                                    <EnglishTitle>JOKER</EnglishTitle>

                                    <BoxButton>
                                        {/*버튼*/}
                                        <BookingButton
                                            onClick={() => {
                                                navigate(`/user/moviepage/:movieId`);
                                            }}
                                        >
                                            영화 보러가기
                                        </BookingButton>


                                        <SNS>
                                            {/*찜*/}
                                            <MovieLike>
                                                <button
                                                    type="button"
                                                    className="MovieLike">
                                                    <img src={like} alt="관심" className="like"></img>
                                                    <span className="p-like">698</span>
                                                </button>
                                            </MovieLike>


                                            {/*공유*/}
                                            <MovieLike>
                                                <button
                                                    type="button"
                                                    className="MovieLike">
                                                    <img src={share} alt="공유" className="share"></img>
                                                    <span className="p-share">공유</span>
                                                </button>
                                            </MovieLike>
                                        </SNS>
                                    </BoxButton>


                                    {/*줄거리*/}
                                    <DesBox className="description">
                                        <div className="step-bar">
                                            <span className="gradation-blue"></span>
                                        </div>

                                        <Destitle>줄거리</Destitle>


                                        <br/>

                                        <DesContent>
                                            {/*줄거리-연습용*/}
                                            <span className="Destitle_span">
                                       내 인생이 비극인줄 알았는데, 코미디였어" 고담시의 광대 아서 플렉은 코미디언을 꿈꾸는 남자. 하지만 모두가 미쳐가는 코미디 같은 세상에서 맨 정신으로는 그가 설 자리가 없음을 깨닫게 되는데...
                                        </span>

                                            {/*줄거리-data*/}
                                            {/*<span>{movieDetailDescription}</span>*/}
                                        </DesContent>

                                        {/*예고편/스틸컷-data**/}
                                        {/*<DetailImg stillCutList={stillCutList}/>*/}
                                    </DesBox>


                                    {/*포스터 제목-data/*/}
                                    {/*<MovieTitle>{movieData.movieName}</MovieTitle>*/}
                                    {/*<EnglishTitle>{movieData.movieNameInEnligh}</EnglishTitle>*/}
                                    {/*<DetailBox>*/}
                                    {/*    <ul className="DetailTitle">*/}
                                    {/*        {Detail_LIST.map(category => {*/}
                                    {/*            return (<DetailTitle key={category.id}>*/}
                                    {/*                {category.title}*/}
                                    {/*            </DetailTitle>);*/}
                                    {/*        })}*/}
                                    {/*    </ul>*/}

                                    {/*    <ul className="DetailContext">*/}
                                    {/*        <DetailContext>{director}토드 필립스</DetailContext>*/}
                                    {/*        <DetailContext>{movieActors?.join(' ')}호야킨 피닉스</DetailContext>*/}
                                    {/*        <DetailContext>{country}미국</DetailContext>*/}
                                    {/*        <DetailContext>{movieAgeRating} 15세 관람가</DetailContext>*/}
                                    {/*        <DetailContext>{movieRunningTime}2시간 1분</DetailContext>*/}
                                    {/*        <DetailContext>{movieGenre?.join(' ')}스릴러</DetailContext>*/}
                                    {/*        <DetailContext>{movieOpeningDate}2019년</DetailContext>*/}
                                    {/*    </ul>*/}
                                    {/*</DetailBox>*/}
                                </AsidePoster>

                                {/*포스터-연습용*/}
                                <MoviePoster src={poster} alt="포스터"/>


                                {/*포스터-data/*/}
                                {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                            </MovieAndDetail>
                        </RightBox>
                    </Box>


                    {/*<CharmingGraph/>*/}
                    {/*<MovieReview/>*/}
                </MovieBox>

                <div className="logoplace"/>
            </WholeContainer>


            <ButtonBox>
                <ScrollBtn
                    right={scrollPosition > 100 ? '0px' : '-30px'}
                    width="136px"
                    scrollPosition={scrollPosition}
                    onClick={() => {
                        navigate(`/user/moviepage/:movieId`);
                    }}
                >
                    영화 보러가기
                </ScrollBtn>

                <ScrollBtn
                    right={scrollPosition > 100 ? '-50px' : '-100px'}
                    width="50px"
                    scrollPosition={scrollPosition}
                    onClick={goToTop}
                >
                    ↑
                </ScrollBtn>
            </ButtonBox>


            {/*바디- 탭구현*/}
            <Wrap>
                <WrapBody>
                    <TabMenu>
                        {menuArr.map((tap, index) => {
                            return (<div
                                key={index}
                                className={currentTab === index ? 'submenu focused' : 'submenu'}
                                onClick={() => selectMenuHandler(index)}
                            >
                                {tap.name}
                            </div>);
                        })}
                        <div>
                            <div>{menuArr[currentTab].content}</div>
                        </div>
                    </TabMenu>
                </WrapBody>
            </Wrap>
        </div>)}
    </Div>);
};


// STYLE -----------------------

//1.전체박스-배경이미지
const Div = styled.div`
    width: 100%;
    display: block;
    margin: 0 auto;
    
    background-image: url("/images/poster.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

//2.첫번째 전체박스 - 블러처리
const WholeContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    backdrop-filter: blur(80px) !important;
    background-color: rgba(0, 0, 0, 0.5);
`;


//3. 전체박스
const MovieBox = styled.div`
  width: 1200px;
    height: 600px;
    
  `;

//4.전체박스
const Box = styled.div`
    width: 1200px;

`;

//5.오른쪽 감싸는 박스
const RightBox = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;
//5-2.오른쪽 전체 감싸는 박스
const MovieAndDetail = styled.div`
  width: 100%;
 
`;


//6.왼쪽 감싸는 박스
const LeftBox = styled.div`
    width: 100%;
    float: left;
`;
//6-2.왼쪽 전체감싸는 박스
const AsidePoster = styled.div`
    width: 600px;
    float: left;
    //margin-left: 60px;
    padding-top: 80px;
`;


//보러가기 아래 버튼
const ButtonBox = styled.div`
    right: 40%;
    margin-right: -548px;
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 80px;
    min-height: 50px;
    text-align: center;
    z-index: 999;
`;


//보러가기 아래 버튼
const ScrollBtn = styled.button`
    opacity: 1;
    pointer-events: auto;
    position: absolute;
    left: auto;
    right: ${props => props.right};
    opacity: ${props => (props.scrollPosition > 100 ? '1' : '0')};
    width: ${props => props.width};
    padding: 12px 0 14px;
    font-weight: 500;
    font-size: 16px;
    color: #fff;
    box-shadow: 0 3px 6px 0 rgb(0 0 0 / 30%);
    //border-radius: 25px;
    transition: right 0.5s;
    cursor: pointer;
    //border: 1px solid white;
    background-color: #1351f9;
    z-index: 999;


    &:disabled {
        cursor: default;
    }
`;




//줄거리 전체 박스
const DesBox = styled.div`
    float: left;
    width: 580px;
    margin-top: 80px;
    margin-left: 10px;
    margin-right: 10px;
    
    
    .step-bar {
        width: 580px;
        height: 5px;
        //background: rgba(72, 65, 58, 0.2);
        background: rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
        //position: absolute;
        //top: 0;
        //left: 0;
    }

    .gradation-blue {
        width: 15%;
        height: 5px;
        display: block;
        text-indent: -9999px;
        background-color: #1351f9;
    }
`;



//줄거리-제목 스타일
const Destitle = styled.span`
    font-weight: 500;
    font-size: 20px;
    color: #fff;
    margin-top: 40px;
    margin-left: 10px;
`;


//줄거리 내용
const DesContent = styled.div`
    font-size: 16px;
    color: #817f7f;
    margin-top: 20px;
    line-height: 22px;
    margin-left: 10px;
`;

//버튼 전체 박스(BoxButton)

const BoxButton = styled.div`
    display: flex;
    justify-content: left;
    margin-top: 20px;
`;

//버튼- 영화 보러가기
const BookingButton = styled.button`
    background-color: #1351f9;
    color: #fff;
    box-shadow: 3px 4px 10px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 12px;
    width: 343px;
    height: 58px;
    margin-top: 10px;
    margin-right: 20px;


    &:hover {
        color: #000;
        background-color: #fff;
    }
`;


//포스터 - 오른쪽
const DetailTitle = styled.li`
    margin-bottom: 30px;
    padding-left: 6px;
    color: #fff;
    opacity: 0.64;
    font-size: 18px;

`;

//내용
const DetailContext = styled.li`
    margin-bottom: 30px;
    font-size: 18px;
    font-weight: 300;
    padding-top: 2px;
    text-overflow: hidden;
    color: #fff;
    font-size: 18px;
    margin-left: 30px;
    line-height: 1.4;

`;

const DetailBox = styled.div`
    display: flex;
    justify-content: left;

    .DetailTitle {
        margin-top: 30px;
    }

    .DetailContext {
        margin-top: 30px;
    }
`;


//한글 제목
const MovieTitle = styled.h1`
    color: #fff;
    font-size: 52px;
    font-weight: 600;
    //padding: 30px 0px;
    //border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    //padding-bottom: 20px;
    padding-top: 30px;
    text-align: left;
`;
//영문 제목
const EnglishTitle = styled.p`
    color: #fff;
    font-size: 24px;
    line-height: 24px;
    font-weight: 300;
    padding-bottom: 20px;
    padding-top: 10px;
    text-align: left;
    //border-bottom: 1px solid rgba(255, 255, 255, 0.18);
`;

//찜+공유 감싸는 박스
const SNS = styled.div`
    margin-top: 10px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;


`;

//찜 전체박스
const MovieLike = styled.button`
    transition: opacity 0.1s;
    cursor: pointer;
    margin-right: 20px;
    display: flex;
    align-items: center;


    //스타일
    //background-color: #1351f9;
    //background-color: #fff;
    border: 1px solid #fff;
    border-radius: 4px;
    width: 120px;
    height: 48px;


    &:hover {
        background-color: #1351f9;
        border: 1px solid #1351f9;
    }


    //찜=글씨+이미지 박스

    .MovieLike {
        position: relative;
        margin-top: 10px;
        display: flex;
        align-items: center;
        margin-left: 15px;


    }

    //이미지(하트)

    .like {
        width: 32px;
        margin-bottom: 10px;
        justify-content: right;

        &:hover {

        }

    }

    //글씨(찜)

    .p-like {
        position: relative;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: rgb(255, 255, 255);
        margin-left: 25px;
        margin-bottom: 10px;
        justify-content: right;

    }

    //이미지(공유)

    .share {
        position: relative;
        width: 32px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
    }

    //글씨(공유)

    .p-share {
        position: relative;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        color: rgb(255, 255, 255);
        margin-left: 25px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
    }

    &:hover {

    }
`;


//포스터 - 이미지
const MoviePoster = styled.img`
    float: right;
    border-radius: 5px;
    width: 343px;
    height: 494px;
    margin-top: 80px;
    margin-left: 80px;
`;


//데이터-연습용
const Detail_LIST = [{id: 1, title: '감독'}, {id: 2, title: '출연'}, {id: 3, title: '국가'}, {id: 4, title: '등급'}, {
    id: 5, title: '상영시간'
}, {id: 6, title: '장르'}, {id: 7, title: '개봉일'},];
export default MovieDetail;



//탭 이하 전체 박스
const Wrap = styled.div`
    width: 100%;
    margin: 0 auto;
    background-color: #000;
`;

//탭 전체 박스
const WrapBody = styled.div`
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: left;
`;

//탭메뉴
const TabMenu = styled.ul`
    width: 1200px;
    
//background-color: red;
float: left;
list-style: none;
margin-bottom: 20px;
margin-top: 10px;
align-items: center;
color: #000;
font-weight: 300;
text-align: center;
font-size: 16px;
    
    
    .focused{
        color: #fff !important;
        border-bottom: 3px solid #1351f9 !important;
       
    }

.submenu {
    margin: 0 auto;
    padding: 10px;
    transition: 0.5s;
    //border: 1px solid rgba(255, 255, 255, 0.2);
    //border-bottom: 1px solid rgb(46, 46, 46);
    
  
    border-bottom: 1px solid #2f2f2f;
    
    outline: none;
    cursor: pointer;
    color: #a6a6a6;
    font-weight: 300;
    text-align: center;
    float: left;
    //padding: 40px;
    padding: 2.5rem 2.5rem;
    height: 20px;


    &:hover{
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
    }
    
    &:focus{
        outline: none;
        cursor: pointer;
        color: #fff !important;
        border-bottom: 5px solid #1351f9 !important;
        font-weight: 300;
        text-align: center;
        transition: 0.5s;
    }
}
`;
