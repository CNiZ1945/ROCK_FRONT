import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReactPlayer from "react-player";
import styled from 'styled-components';
import { api } from '../../../api/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { EffectFade, Pagination, Autoplay } from 'swiper';

const Videos = () => {
    const [movies, setMovies] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const playerRefs = useRef([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get(`/user/main/updated-trailers`);
                console.log('Fetched data:', response.data);
                setMovies(response.data);
            } catch (error) {
                console.error('비디오 데이터를 가져오는 중 오류 발생:', error);
            }
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        if (playerRefs.current[0]) {
            playerRefs.current[0].getInternalPlayer()?.playVideo();
        }
    }, [movies]);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    const handleVideoEnd = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    return (
        <VideoWrapper>
            <StyledSwiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                pagination={{ clickable: true }}
                modules={[EffectFade, Pagination]}
                effect="fade"
                className="mySwiper"
                onSlideChange={handleSlideChange}
            >
                {movies.map((movie, index) => (
                    <SwiperSlide key={movie.movieId}>
                        <VideoTextWrapper>
                            <VideoTitle>{movie.movieTitle}</VideoTitle>
                            <VideoContext>{movie.movieDescription || '줄거리 정보가 없습니다.'}</VideoContext>
                            <VideoBtn onClick={() => navigate(`/user/MoviePlay/${movie.movieId}`)}>
                                재생
                            </VideoBtn>
                            <VideoBtn onClick={() => navigate(`/user/MoviePage/${movie.movieId}`)}>
                                상세 보기
                            </VideoBtn>
                        </VideoTextWrapper>
                        <MainVideoWrapper>
                            <MainVideo
                                className="MainVideo"
                                ref={el => playerRefs.current[index] = el}
                                url={movie.mainTrailer?.trailerUrls || movie.trailer?.trailerUrls}
                                playing={index === activeIndex}
                                muted
                                loop={false}
                                controls={false}
                                width="100%"
                                height="100%"
                                onEnded={handleVideoEnd}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            modestbranding: 1,
                                            rel: 0,
                                            controls: 0,
                                            showinfo: 0,
                                            fs: 0,
                                            iv_load_policy: 3,
                                            disablekb: 1,
                                            playsinline: 1,
                                            autohide: 1,
                                            end: 0,
                                            autoplay: 1,
                                        },
                                        embedOptions: {
                                            height: '100%',
                                            width: '100%'
                                        }
                                    }
                                }}
                            />
                        </MainVideoWrapper>
                    </SwiperSlide>
                ))}
            </StyledSwiper>
        </VideoWrapper>
    );
};

export default Videos;

//비디오 메인 전체 사이즈
const VideoWrapper = styled.div`
    position: relative;
    width: 100vw;
    //height: 100vh;
    //height: 580px;
    overflow: hidden;
    margin-bottom: 60px;
    //border: 1px solid red;
`;

const MainVideoWrapper = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 110%;  // 여기 사이즈!! 중요함!!
    overflow: hidden;
    object-fit: contain;
    //border: 1px solid yellow;
`;



const VideoTextWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 120px;
    transform: translateY(-50%);
    width: 600px;
    text-align: start;
    z-index: 10;
`;

const VideoTitle = styled.h2`
    color: #fff;
    font-size: 40px;
    font-weight: 600;
    text-shadow: 1px 1px 3px black;
`;

const VideoContext = styled.p`
    margin: 30px 0 35px 0;
    color: #fff;
    font-weight: 300;
    font-size: 17px;
    line-height: 25px;
    opacity: 1;
`;

const VideoBtn = styled.button`
    width: 120px;
    margin: 15px 10px;
    padding: 10px 10px;
    border: 2px solid #fff;
    border-radius: 5px;
    color: white;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;
    background: rgba(0, 0, 0, 0.5);

    &:hover {
        color: #02d6e8;
        border: 2px solid #02d6e8;
        font-weight: 800;
        background: rgba(0, 0, 0, 0.7);
    }
`;
//비디오 사이즈
const MainVideo = styled(ReactPlayer)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    object-fit: fill;
`;
// 슬라이드 버틍
const StyledSwiper = styled(Swiper)`
    width: 100%;
    height: 620px;
    background-color: rgb(11, 11, 13);
    
    .mySwiper{
        margin-right: 20px;
        background-color: red;
    }
    .swiper-pagination-bullet {
        opacity: 1;
        background-color: #fff;
        //margin: 0 5px;
        //margin-bottom: 80px;
        width: 12px;
        height: 12px;
    }

    .swiper-pagination-bullet-active {
        background-color: #ff27a3;
    }

    .swiper-button-prev,
    .swiper-button-next {
        color: #fff;
    }
`;