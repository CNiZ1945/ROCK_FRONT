import React, { Children, useEffect, useState } from 'react';

//chart.js
import {
    Chart as ChartJs, LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler,
} from 'chart.js';


import { Radar } from 'react-chartjs-2';
import styled from 'styled-components';
import { api } from '../../api/axios';


ChartJs.register(LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler);


//CharmingGraph -그래프
const CharmingGraph = ({ movieId }) => {
    const [error, setError] = useState(null);
    const [chartImages, setChartImages] = useState({
        gender: null,
        age: null,
        attraction: null,
        emotion: null
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            fetchMovieChartImages();
        }

        return () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                api.post(`/user/movies/${movieId}/delete-image`, {
                    fileNames: [
                        `age_chart_${movieId}.png`,
                        `attraction_chart_${movieId}.png`,
                        `emotion_chart_${movieId}.png`,
                        `gender_chart_${movieId}.png`
                    ]
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(response => {
                        console.log('Images deleted:', response.data);
                    })
                    .catch(error => {
                        console.error('Error deleting images:', error);
                    });
            }
        };
    }, [movieId]);


    const fetchMovieChartImages = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) throw new Error("로그인 토큰이 없습니다.");

            const chartTypes = ['gender', 'age', 'attraction', 'emotion'];
            
            const requests = chartTypes.map(type =>
                api.get(`/user/movies/${movieId}/${type}-chart`, {
                    responseType: 'arraybuffer',
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(response => {
                    const blob = new Blob([response.data], { type: 'image/png' });
                    const url = URL.createObjectURL(blob);
                    return { type, url };
                })
            );

            const results = await Promise.all(requests);
            const images = results.reduce((acc, { type, url }) => {
                acc[type] = url;
                return acc;
            }, {});
            setChartImages(images);
        } catch (error) {
            setError('차트 이미지를 불러오는 데 실패했습니다.');
        }
    };

    const graphIndex = ["‍🧑 성별 분포", "🎓 연령별 분포이", "❤️ 매력 포인트", "😳 감정 포인트"];

    return (
        <GraphContainer>
            {Object.keys(chartImages).map((type, idx) => (
                chartImages[type] ? (
                    <ScoreGraph key={type}>
                        <GraphTitle>{graphIndex[idx]}</GraphTitle>
                        <GraphImage>
                            <ChartDiv>
                                <ReviewChartImg src={chartImages[type]} alt={`${graphIndex[idx]} 차트`} />
                            </ChartDiv>
                        </GraphImage>
                    </ScoreGraph>
                ) : null
            ))}
            {error && <div>{error}</div>}
        </GraphContainer>
    );
};

//style

//타이틀
const GraphTitle = styled.div`

    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    display: flex;
    justify-content: center;
    border-bottom: 5px solid #f4f4f4;
    margin: 0 auto;
    padding-top: 10px;
    margin-bottom: 25px;
    padding-bottom: 12px;

`;

const GraphImage = styled.div`
// text-align: center;
    width: 100%;
    // border: 1px solid red;
    display: flex;
    
    
    `
const ScoreGraph = styled.div`
    // width: 280px;
    height: 400px;
    // border: 1px solid blue;
    margin-right: 10px;
    
    `;

const GraphContainer = styled.div`
    
    display: flex;
    // width: 100%;
    justify-content: space-around;

    `;

// 리뷰 차트 이미지
const ReviewChartImg = styled.img`
width: 280px;
`
const ChartDiv = styled.div`
width: 100%


`

export default CharmingGraph;
