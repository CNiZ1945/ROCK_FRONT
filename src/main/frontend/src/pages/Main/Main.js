
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PosterSwiper from './Swiper/PosterSwiper';
import VideoSwiper from './VideoSwiper/VideoSwiper';
import MainTop4 from './MainTop4';
import Navs from "../../components/Nav/Navs";
import axios  from 'axios';


function Main() {
	const navigate = useNavigate();
	
	// axois api 설정
	const api = axios.create({
		baseURL : 'http://localhost:8080',

	});

	// 상태 설정
	const [updatedMovie, setUpdatedMovie] = useState([]);
	const [rankingMovie, setRankingMovie] = useState([]);
	const [recentWatched, setRecentWatched] = useState([]);
	const [continueWatching, setContinueWatching] = useState([]);
	
	// 로딩 상태
	const [loading, setLoading] = useState(true);
	// 에러 상태
	const [error, setError] = useState(false);


	const fetchData = async (url, set) => {
		try {
			const response = await api.get(url);
			set(response.data);	
		} 
		catch (error) {
			setError(error);
			console.error(`${url} error`, error);
		}
	};

	//useEffect()를 통해서 정보 받기
	useEffect(() => {
		const fetchAllData = async () => {
			await Promise.all([
				fetchData('/main/updated', setUpdatedMovie),
				fetchData('/main/ranking', setRankingMovie),
				fetchData('/user/movies/history/recent-Watched', setRecentWatched),
				fetchData('/user/movies/history/continue', setContinueWatching),
			]);

			setLoading(false);
		}
		fetchAllData();
	}, []);

    // 로딩 중이거나 에러가 있는 경우 처리
    if (loading) return (<div>Loading...</div>);
    if (error) return (<div>Error: {error.message}</div>);


	return (
		<MainContainer>
			<VideoSwiper />
			<SectionANav>
				회원님을 위한,&nbsp;<span className="SectionANav">추천 콘텐츠</span>
			</SectionANav>

			<SectionA>
				<PosterSwiper data={recentWatched} />
				<PosterSwiper data={continueWatching} />
				<PosterSwiper data={rankingMovie} />
				<PosterSwiper data={updatedMovie} />
				{/* <MainTop4 /> */}
			</SectionA>
		</MainContainer>
	);
}



// 메인 문구- 부모 박스
const SectionANav = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap');
    font-family: "Nanum Gothic", sans-serif;
    font-size: 1.2rem;
    color: rgba(255,255,255,1);
    font-weight: 500;
    letter-spacing: -2px;
    line-height: 1.5;
    padding: 0 0 1rem;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    margin-left: 3rem;
    z-index: 1;
    padding-top: 5rem;
    
    .SectionANav{
        font-size: 1.2rem;
        color: #02d6e8;
        font-weight: 700;
        line-height: 1.5;
        letter-spacing: -0.5px;
    }
`;


const MainContainer = styled.div`
    width: 100%;
    background-color: rgb(11, 11, 13) !important;

`;

// 2단 배너 + 문구 사이
const SectionA = styled.div`
  width: 100vw;
  //padding: 20px;
  display: flex;
    //flex-flow:wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
    margin-top: 2rem;
    //margin-left: 15rem;
`;

const SectionTop = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 80px;
  margin-left: 100px;
  margin-top: 20px;
`;
const SectionTopTitleColored = styled.h3`
  color: #fff;
  font-weight: 700;
  font-size: 25px;
`;

const SectionTopTitle = styled.h3`
  margin-left: 15px;
  font-weight: 400;
  color: gray;
  font-size: 25px;
`;

const SectionTopMore = styled.button`
  position: absolute;
  right: 200px;
  color: #fff;
  padding: 8px 15px;
  border: 2px solid #fff;
  border-radius: 30px;
  background: transparent;
  font-weight: 700;
  font-size: 15px;
  transition: 0.3s;

  &:hover {
    color: white;
    background: #fff;
    transition: 0.3s;
  }
`;

export default Main;


