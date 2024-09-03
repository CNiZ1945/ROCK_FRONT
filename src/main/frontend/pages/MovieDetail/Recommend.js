import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import PersonalCharts from './component/PersonalCharts';
import PreferActorsAndDirectors from "./component/PreferActorsAndDirectors";
import PointsContent from './component/PointsContent';
import PointsCollab from './component/PointsCollab';
import MovieCollab from './component/MovieCollab';
import bullet from "../SearchKeyword/images/bullet.svg";
import { api } from '../../api/axios';

//images
import Recommend_Graph01 from "./images/Recommend_Graph01.png";
import Recommend_Graph02 from "./images/Recommend_Graph02.png";
import Recommend_Graph03 from "./images/Recommend_Graph03.png";
import top from "../Login/images/top.png";

//Recommend -----------------------------
const Recommend = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [memberInfo, setMemberInfo] = useState(null);
    const [filesToDelete, setFilesToDelete] = useState({
        images: [],
        json: []
    });

    // 회원 정보 가져오기
    const fetchMemberInfo = useCallback(async (token) => {
        try {
            const response = await api.get('/auth/memberinfo', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return {
                role: response.data.memRole,
                memName: response.data.memName,
                memNum: response.data.memNum
            };
        } 
        catch (error) {
            console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            if (error.response && error.response.status === 401) {
                setError("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/Login');
            } else {
                setError("사용자 정보를 가져오는데 실패했습니다.");
            }
            throw error;
        }
    }, [navigate]);

    const addFileToDelete = useCallback((fileName, fileType) => {
        setFilesToDelete(prev => ({
            ...prev,
            [fileType]: [...prev[fileType], fileName]
        }));
    }, []);

    const addFilesToDeleteList = useCallback((memNum) => {
        // 이미지 파일 경로
        addFileToDelete(`personal_attraction_${memNum}.png`, 'images');
        addFileToDelete(`personal_emotion_${memNum}.png`, 'images');
        addFileToDelete(`personal_genres_${memNum}.png`, 'images');

        // JSON 파일 경로
        addFileToDelete(`movie_collab_recommend_${memNum}.json`, 'json');
        addFileToDelete(`personal_actors_${memNum}.json`, 'json');
        addFileToDelete(`personal_directors_${memNum}.json`, 'json');
        addFileToDelete(`points_collab_recommend_${memNum}.json`, 'json');
        addFileToDelete(`points_content_recommend_${memNum}.json`, 'json');
    }, [addFileToDelete]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !memberInfo) {
            fetchMemberInfo(token)
                .then(info => {
                    setMemberInfo(info);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError('데이터를 불러오는데 실패했습니다.');
                });
        }

        // 페이지 언마운트 시 파일 삭제 처리
        return () => {
            if ((filesToDelete.images.length > 0 || filesToDelete.json.length > 0) && memberInfo) {
                const deleteFiles = async () => {
                    try {
                        const token = localStorage.getItem('accessToken');
                        // 이미지 파일 삭제
                        if (filesToDelete.images.length > 0) {
                            await api.post(`/user/personal/${memberInfo.memNum}/delete-img`,
                                { fileNames: filesToDelete.images },
                                { headers: { 'Authorization': `Bearer ${token}` } }
                            );
                        }

                        // JSON 파일 삭제
                        if (filesToDelete.json.length > 0) {
                            await api.post(`/user/personal/recommend/${memberInfo.memNum}/delete-files`,
                                { fileNames: filesToDelete.json },
                                { headers: { 'Authorization': `Bearer ${token}` } }
                            );
                        }

                        console.log('임시 파일들이 성공적으로 삭제되었습니다.');
                    } catch (error) {
                        console.error('임시 파일 삭제 중 오류 발생:', error);
                    }
                };

                deleteFiles();
            }
        };
    }, [filesToDelete, memberInfo, fetchMemberInfo]);

    useEffect(() => {
        if (memberInfo && memberInfo.memNum) {
            addFilesToDeleteList(memberInfo.memNum);
        }
    }, [memberInfo, addFilesToDeleteList]);


    //HTML
    return (
        <WrapBody>

            {/*01.상단*/}
            <TopContainer>
                <Section>
                    <TopImg src={top}></TopImg>
                    <ProfileBoxContainer>
                        <TitelBox>
                            <span className="names">{memberInfo?.memName}</span>&nbsp;님&nbsp;만의 추천 리스트를 받아보세요.
                        </TitelBox>
                        <TitleSub>
                            재밌게 본 영화의 리뷰를 작성해보세요!
                            여러분의 취향과 비슷한 분들을 찾아서, 그분들이 좋아한 영화를 추천해 드릴게요!
                        </TitleSub>
                    </ProfileBoxContainer>
                </Section>
            </TopContainer>


            {/*02.그래프*/}

            <GrapTitle>{memberInfo?.memName} 회원님의 영화 취향 분석</GrapTitle>

            <Wrap>
                {memberInfo && <PersonalCharts memNum={memberInfo.memNum} />}
            </Wrap>

            {/*02-2. 3가지 리스트*/}
            <Txt><a className="txt">영화 정보</a></Txt>

            <DetailBox>
                <DetailTitle>
                <ul className="DetailTitle">
                    <DetailTitles>
                    {Detail_LIST.map(category => {
                        return (<DetailTitle key={category.id}>
                            {category.title}
                        </DetailTitle>);
                    })}
                    </DetailTitles>
                </ul>
                </DetailTitle>
                {memberInfo && <PreferActorsAndDirectors  memNum={memberInfo.memNum} />}
            </DetailBox>


            {/*03.추천 리스트- 연습용*/}
            <RecommendConstainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>회원님을 위한 추천 콘텐츠</SectionTitle>
                    </SectionTop>

                    <SectionContainer>
                        {memberInfo && <PointsContent  memNum={memberInfo.memNum} />}
                    </SectionContainer>
                </Container>
            </RecommendConstainer>

            <RecommendConstainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>회원님을 위한 추천 콘텐츠</SectionTitle>
                    </SectionTop>

                    <SectionContainer>
                        {memberInfo && <PointsCollab  memNum={memberInfo.memNum} />}
                    </SectionContainer>
                </Container>
            </RecommendConstainer>

            <RecommendConstainer>
                <Container>
                    <SectionTop>
                        <SectionTitle>회원님을 위한 추천 콘텐츠</SectionTitle>
                    </SectionTop>

                    <SectionContainer>
                        {memberInfo && <MovieCollab  memNum={memberInfo.memNum} />}
                    </SectionContainer>
                </Container>
            </RecommendConstainer>

        </WrapBody>);
};
export default Recommend;


// 감독/영화배우/장르 ----------------------------------------------
//데이터-연습용
const Detail_LIST = [
    {id: 1, title: '상위 감독 리스트'}, {id: 2, title: '상위 배우 리스트'}];


//부모박스
const DetailBox = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 80px;
    border-radius: 8px;
    background-color: rgb(11, 11, 13) !important;
    border: 1px solid rgb(25, 31, 40);
    display: flex;
    padding: 10px 40px;
`;

//텍스트
const Txt = styled.div`
    width: 200px;
    height: 50px;
    padding: 10px 0;
    text-align: left;
    margin-top: 20px;

    width: 1024px;
    margin: 0 auto;
    margin-bottom: 20px;
    display: flex;
    border-top: 1px solid rgb(33, 33, 33);
    border-bottom: 1px solid rgb(33, 33, 33);
    //border-radius: 8px;
    //background-color: rgb(11, 11, 13) !important;
    //border: 1px solid rgb(25, 31, 40);
    
    
    .txt{
        font-size: 18px;
        line-height: 86px;
        color: #fff;
        font-weight: 400;
        vertical-align: middle;
        display: flex;
        align-items: center;
        margin-left: 20px;
        padding: 0 30px;
    }
`;
const DetailTitles = styled.div`
    width: 160px;
    height: 90px;
`;

//제목: 리스트
const DetailTitle = styled.li`
    color: #fff;
    opacity: 0.64;
    font-size: 16px;
    text-align: left;
    text-indent: 15px;
    list-style: none;
    display: flex;
    align-items: center;
    width: 160px;
    height: 90px;
`;


// ----------------------------------------------
//전체 박스
const WrapBody = styled.div`
    width: 100%;
    //height: 100vh;
    margin: 0 auto;
`;

const TopContainer = styled.div`
    width: 100%;
    grid-template-columns: 10rem minmax(auto, 100%) min-content;
    column-gap: 2rem;
    padding: 20px 40px;
    background-color: rgb(11, 11, 13) !important;
    border: 1px solid rgb(25, 31, 40);
    margin-bottom: 40px;
`;


// 프로필 감싸는 박스
const Section = styled.div`
    width: 1024px;
    display: flex;
    align-items: center;
`;

// 프로필 박스
const ProfileBoxContainer = styled.div`
    width: 1024px;
    //display: flex;
    margin-top: 20px;
    
`;


//나의 이용권-글씨
const TitleSub = styled.div`
    width: 600px;
    font-size: 14px;
    padding: 20px 20px;
    color: #a3a3a3;
    background-color: rgba(0, 0, 0, 1);
    border-radius: 12px;
    font-family: 'SUIT-Regular' !important;
    text-align: left;
    font-weight: 500;
    margin-bottom: 20px;
`;


// 프로필
const TopImg = styled.img`
    width: 160px;
    height: 160px;
    margin-right: 30px;
`;


//오른쪽- 전체 박스
const TitelBox = styled.div`
    width: 800px;
    color: #fff;
    font-family: 'SUIT-Regular';
    font-size: 20px;
    text-align: left;
    font-weight: 100;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    z-index: 1;
    margin-bottom: 10px;
    text-indent: 10px;

    .names {
        color: #ffa000;
        font-weight: 600;
    }
`;




//A.그래프 박스 스타일 -----------------------------------
//그래프 전체 박스 - 그래프 자리
const Wrap = styled.div`
    //사이즈
    width: 1024px;
    margin: 0 auto;
    //padding-top: 40px;
    //padding-bottom: 40px;
    margin-bottom: 25px;
    border-radius: 8px;
    //디자인
    //background-color: rgba(255, 255, 255, 0.1);
    background-color: #fff;
    display: flex;
`;


//그래프 타이틀
const GrapTitle = styled.div`
    margin: 0 auto;
    width: 1024px;
    
    font-size: 20px;
    line-height: 86px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
`;


//B.바디 -----------------------------------


//1.추천 바디 박스
const RecommendConstainer = styled.div`
    width: 1044px;
    margin: 0 auto;
`;


//포스터 감싸는 전체 박스
const SectionContainer = styled.div`
    width: 1044px;
    display: flex;
    flex-direction: row;
    gap: 30px;
    //margin-bottom: 80px;
`;

//01.타이틀: 에피소드
const SectionTop = styled.div`
    width: 1044px;
    display: flex;
`;
const SectionTitle = styled.div`
    font-size: 20px;
    line-height: 86px;
    color: #fff;
    font-weight: 400;
    vertical-align: middle;
    //margin-top: 140px;
`;


//3.바디 감싸는 박스
const Container = styled.div`
    width: 1024px;
    margin: 0 auto;
    margin-bottom: 40px;
    
 
`;


