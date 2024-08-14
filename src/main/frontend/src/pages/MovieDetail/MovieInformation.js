import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useParams, useNavigate} from 'react-router-dom';
import poster from './images/poster.jpg'

import Actor from './images/Actor.jpg'
import Director from './images/Director.jpg'

// import authorship1 from './images/authorship1.jpg'
// import authorship2 from './images/authorship2.jpg'
// import authorship3 from './images/authorship3.jpg'


//영화,상세정보 탭
const MovieInformation = () => {
    const [movieData, setMovieData] = useState({});
    const [scrollPosition, setScrollPosition] = useState(0);
    const [toggleBtn, setToggleBtn] = useState(true);
    const params = useParams();
    const navigate = useNavigate();

    const {
        movieThumbNailImg,
        movieName,
        director,
        movieActors,
        country,
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
    return (

        <Div>
            {movieData && (<div>
                <WholeContainer>
                    <div className="logoplace"/>


                    {/*1.썸네일*/}
                    <ThumbBox>
                        {/*포스터-연습용*/}
                        <MoviePoster src={poster} alt="포스터"/>

                        {/*포스터-data/*/}
                        {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                    </ThumbBox>


                    {/*2.줄거리*/}
                    <DesBox className="description">

                        <Destitle>줄거리</Destitle>
                        <DesContent>
                            {/*줄거리-연습용*/}
                            <span className="Destitle_span">
고담시에 사는 광대 아서 플렉은 착하게 살아보려 하지만
인생의 부조리함과 쓴 맛이 끊임없이 그를 압도한다.짝사랑도,
커리어도 마음대로 되지 않고 자신을 향한 세상의 더러움을
견디다 못한 그는 결국 최악의 악당 조커로 재탄생한다.
내 인생이 비극인줄 알았는데, 코미디였어"
고담시의 광대 아서 플렉은 코미디언을 꿈꾸는 남자.
하지만 모두가 미쳐가는 코미디 같은 세상에서 맨 정신으로는 그가 설 자리가 없음을 깨닫게 되는데...
                            </span>

                            {/*줄거리-data*/}
                            {/*<span>{movieDetailDescription}</span>*/}
                        </DesContent>
                    </DesBox>



                    {/*3.감독*/}
                    <Txt><a className="txt">감독</a></Txt>
                    <DirectorBox>
                        {/*포스터-연습용*/}
                        <DirectorPoster src={Director} alt="감독1"/>
                        <DirectorPoster src={Director} alt="원작자2"/>
                        <DirectorPoster src={Director} alt="원작자3"/>
                        {/*포스터-data/*/}
                        {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                    </DirectorBox>


                    <Txt><a className="txt">출연</a></Txt>
                    <ActorBox>
                        {/*포스터-연습용*/}
                        <ActorPoster src={Actor} alt="출연배우1"/>
                        <ActorPoster src={Actor} alt="출연배우1"/>
                        <ActorPoster src={Actor} alt="출연배우1"/>
                        {/*포스터-data/*/}
                        {/*<MoviePoster src={movieData.movieThumbNailImg} alt="포스터" />*/}
                    </ActorBox>


                    <Txt><a className="txt">영화 정보</a></Txt>

                    <DetailBox>
                        <ul className="DetailTitle">
                            {Detail_LIST.map(category => {
                                return (<DetailTitle key={category.id}>
                                    {category.title}
                                </DetailTitle>);
                            })}
                        </ul>
                        <ul className="DetailContext">
                            <DetailContext>{director}토드 필립스</DetailContext>
                            <DetailContext>{movieActors?.join(' ')}호야킨 피닉스</DetailContext>
                            <DetailContext>{country}미국</DetailContext>
                            <DetailContext>{movieAgeRating} 15세 관람가</DetailContext>
                            <DetailContext>{movieRunningTime}2시간 1분</DetailContext>
                            <DetailContext>{movieGenre?.join(' ')}스릴러</DetailContext>
                            <DetailContext>{movieOpeningDate}2019년</DetailContext>
                        </ul>
                    </DetailBox>

                </WholeContainer>
            </div>)}
        </Div>);
};
export default MovieInformation;


// STYLE -----------------------

//1.전체박스
const Div = styled.div`
    width: 100%;
    margin: 80px auto;
    margin-top: 120px;
    
`;

//2.첫번째 전체박스
const WholeContainer = styled.div`
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    color: #a5a5a5;
    margin: 0 auto;
`;

const ThumbBox = styled.div`
    flex: none;
    position: relative;
    overflow: hidden;
    width: 185px;
    height: 278px;
    border-radius: 12px;
`;
//포스터 - 이미지
const MoviePoster = styled.img`
    width: 185px;
    height: 278px;
`;

//감독- 전체 박스
const DirectorBox = styled.div`
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
   
    //디자인
    margin-top: 30px;
    margin-left: 10px;
    display: flex;
    justify-content: left;
    
`;

//배우-이미지 박스
const ActorBox = styled.div`
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    //디자인
    margin-top: 30px;
    margin-left: 10px;
    display: flex;
    justify-content: left;
`;



//텍스트
const Txt = styled.div`
    //background-color: #1b1b1b;
    //border-radius: 12px;
    border-bottom: 1px solid rgb(33, 33, 33);
    width: 785px;
    height: 50px;
    padding: 10px 0;
    text-align: left;
    margin-top: 40px;
    
    .txt{
        color: #fff;
        margin-left: 20px;
        font-size: 16px;
        display: flex;
       align-items: center;
    }
`;

//감독 포스터(이미지)
const DirectorPoster = styled.img`
    float: left;
    width: 200px;
    border-radius: 12px;
    margin-right: 20px;
   
`;
//배우 포스터(이미지)
const ActorPoster = styled.img`
    float: left;
    width: 200px;
    border-radius: 12px;
    margin-right: 20px;
`;


const DetailBox = styled.div`
    
    width: 785px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    

    .DetailTitle {
        
    }

    .DetailContext {
    }
`;





//줄거리 전체 박스
const DesBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 580px;
    height: 200px;
    margin-left: 20px;
    line-height: 30px;
`;

//줄거리-제목 스타일
const Destitle = styled.span`
    font-weight: 500;
    font-size: 20px;
    text-align: left;
    color: #fff;
    margin-top: 20px;
    margin-left: 10px;
    //border-bottom: 1px solid #fff;
`;


//줄거리 내용
const DesContent = styled.div`
    text-align: left;
    font-size: 16px;
    color: #817f7f;
    margin-left: 10px;
    margin-top: 20px;
    
    //줄거리 내용
    .Destitle_span{
        margin-top: 20px;
    }
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
    margin-bottom: 20px;
    padding-left: 6px;
    color: #fff;
    opacity: 0.64;
    font-size: 18px;
    text-align: left;
    text-indent: 15px;
`;

//내용
const DetailContext = styled.li`
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: 300;
    padding-top: 2px;
    text-overflow: hidden;
    color: #fff;
    font-size: 18px;
    margin-left: 30px;
    line-height: 1.4;
    text-align: left;
    
`;

//데이터-연습용
const Detail_LIST = [{id: 1, title: '감독'}, {id: 2, title: '출연'}, {id: 3, title: '국가'}, {id: 4, title: '등급'}, {
    id: 5, title: '상영시간'
}, {id: 6, title: '장르'}, {id: 7, title: '개봉일'},];




