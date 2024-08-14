import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import styled from 'styled-components';
import Videos from './Videos';
import mp4Video from "./Feathers McGraw returns in Wallace & Gromit Vengeance Most Fow.mp4";
import axios from 'axios';
import { Link } from 'react-router-dom';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './VideoSwiper.css';

// import required modules
import { EffectFade, Pagination, Navigation } from 'swiper';



//App
export default function App() {
    // const [movieData, setMovieData] = useState({});
    // 변수 설정
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTrailer, setShowTrailer] = useState(false);
    const timeRef = useRef(null);

    //axios api 설정
    const api = axios.create({
        baseURL: "http://localhost:8080",
        headers: { 'Content-Type': 'application/json' },
    })

    useEffect(() => {
        const fetchUpdatedWidthTrailers = async () => {
            try {
                const response = await api.get(`/main/updated-trailers`);
                setMovies(response.data);
            }
            catch (error) {
                console.error("trailer error:", error);
            }
        }
        fetchUpdatedWidthTrailers();
    }, []);

    useEffect(() => {
        if (movies.length > 0) {
            setShowTrailer(false);
            clearTimeout(timeRef.current);
            timeRef.current = setTimeout(() => {
                setShowTrailer(true);
            }, 1000);
        }

        return () => clearTimeout(timeRef.current);
    }, [currentIndex, movies]);


    const nextSlide = useCallback(() => {
        //
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, [movies.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevSlide) => (prevSlide - 1 + movies.length) % movies.length);

    }, [movies.length]);

    const handleTrailerEnded = () => {
        nextSlide();
    };

    if (movies.length === 0) {
        return (
            <>
                <div>
                    Loadinng....

                </div>
            </>
        );
    }

    const currentMovie = movies[currentIndex];

    return (
        <>
            {showTrailer && currentMovie.trailer ?
                (
                    <StyledSwiper
                        slidesPerView={1}
                        spaceBetween={100}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        // navigation={true}
                        modules={[EffectFade, Pagination]}
                        effect="fade"
                        className="mySwiper"
                    >
                        {/* <SwiperSlide>
        <Videos movieData={movieData} />
      </SwiperSlide> */}

                        {movies.map(item => (
                            <SwiperSlide key={item.id}>
                                <Videos item={item} />
                            </SwiperSlide>
                        ))}
                    </StyledSwiper>
                ) :
                (
                    <div className="slide_content">
                        <img
                            src={currentMovie.poster ? currentMovie.poster.posterUrls : '포스터'}
                            alt={currentMovie.movieTitle}
                            className={"slide_img"}
                        />
                        <div className="slide-info">
                            <h2 className="movie-title">{currentMovie.movieTitle}</h2>
                            <p className="movie-description">{currentMovie.movieDescription}</p>
                            <div className="button-group">
                                <Link to={`/user/MoviePlay/${currentMovie.movieId}`} className="btn play">재생</Link>
                                <Link to={`/user/MoviePage/${currentMovie.movieId}`}
                                    className="btn details">상세정보</Link>
                            </div>
                        </div>
                    </div>
                )}
            <button className="nav-button prev" onClick={prevSlide}>&lt;</button>
            <button className="nav-button next" onClick={nextSlide}>&gt;</button>
            <div className="indicator-container">
                {movies.map((_, index) => (
                    <span
                        key={index}
                        className={`indicator ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    >
                        {index + 1}
                    </span>
                ))}
            </div>
        </>
    );
}


//StyledSwiper
const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 650px;
  background-color: rgb(11, 11, 13);

  .swiper-pagination .swiper-pagination-bullet {
    opacity: 1;
    border: 1px solid white;
    background-color: #fff;
    margin-bottom: 25px;
      
  }
  .swiper-pagination .swiper-pagination-bullet-active {
    width: 30px;
    border-radius: 10px;
    background-color: white;
    transition: 0.2s ease-out;
  }
`;


//VIDEO_DATA

// const VIDEO_DATA = [
//     {
//         // 메인페이지 banner 정보
//         id: 13,
//         title: 'Wallace & Gromit: Vengeance Most Fowl',
//         video_url:
//             mp4Video,
//         description:
//             '월레스와 그로밋 시리즈의 6번째 애니메이션 작품이자 두번째 장편 애니메이션 마지막으로 나온 애니메이션 작품인 월레스와 그로밋: 빵과 죽음의 문제 이후 16년 만에 공개되었다. 월레스와 그로밋 시리즈 중 최초로 월레스와 그로밋: 전자바지 소동에서 바로 이야기가 이어지는 속편이다. ',
//     },
// ];
