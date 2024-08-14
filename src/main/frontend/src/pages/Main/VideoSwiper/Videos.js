import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReactPlayer from 'react-player';


// Videos
const Videos = ({ item, movieData }) => {
  const { id, movieTitle, description, trailerUrls } = item;

  const navigate = useNavigate();

  const goToBooking = () => {
    navigate(`/`);
  };

  return (
    <VideoWrapper>
      <VideoTextWrapper>
        <VideoTitle>{item.movieTitle}</VideoTitle>

        <VideoContext>{item.description}</VideoContext>

        {/*재생 ? */}
        <VideoBtn
          onClick={() => {
            navigate(`/user/MoviePlay/${item.movieId}`);
          }}
        >
          재생
        </VideoBtn>


        {/*상세정보 - 팝업창 띄울 것인지? */}
        <VideoBtn onClick="">상세 정보</VideoBtn>

      </VideoTextWrapper>
      <MainVideo>
        <ReactPlayer
          alt="mainVideo"
          className="react-player"
          src={item.trailerUrls}
          autoPlay
          muted
          loop
        />

      </MainVideo>
    </VideoWrapper>
  );
};
export default Videos;




// 메인 동영상 스타일
const VideoWrapper = styled.div`
  position: relative;
  width: 100vw;
  // height: 500px;
  overflow: hidden;
`;

// ■메인 배너 슬라이드 문구
const VideoTextWrapper = styled.div`
  position: absolute;
    top: 30%;
    left: 120px;
  width: 600px;
  text-align: start;
  z-index: 10;
  // background-color: rgba(0, 0 , 0, 0.4)
  // border: 1px solid red;
`;

// ■메인 배너 슬라이드 문구
const VideoTitle = styled.h2`
  color: #fff;
  font-size: 40px;
  font-weight: 600;
  text-shadow: 1px 1px 3px black;
`;

// 내용
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
  //background: #02d6e8;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;

    
    //버튼 클릭 했을 때
  &:hover {
    color: #02d6e8;
      border: 2px solid #02d6e8;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.19);
    transition: 0.3s;
  }
`;

const MainVideo = styled.div`

  .react-player{
    width: 100vw;
    // margin-top: -170px;
    z-index: 0;
      margin-bottom: 20px;
    }

`;