import React, { Children } from 'react';

//chart.js
import {
    Chart as ChartJs, LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler,
} from 'chart.js';


import {Radar} from 'react-chartjs-2';
import styled from 'styled-components';


ChartJs.register(LineElement, PointElement, Tooltip, Legend, RadialLinearScale, Filler);


//CharmingGraph -그래프
const CharmingGraph = ({index, children}) => {
    return (<GraphContainer>
            <ScoreGraph>
                <GraphTitle>{index}</GraphTitle>
                {/* <Radar data={charmingData} options={labelFont}/> */}
                <GraphImage>
                    {children}
                </GraphImage>
            </ScoreGraph>
        </GraphContainer>);
};

//style

//타이틀
const GraphTitle = styled.div`
    width: 100%;
    text-align: center;
    font-family: 'SUIT-Regular';
    font-size: 23px;
    font-weight: 600;
    color: #000;
    margin-bottom: 10px;
    //border-bottom: 12px solid #f1f1f3;
    // display: inline-block;
`;

const GraphImage = styled.div`
// text-align: center;
    width: 100%;
    

`
const ScoreGraph = styled.div`
    width: 280px;
    height: 400px;
    
    `;
    
    const GraphContainer = styled.div`
    
    display: flex;
    // width: 100%;
    justify-content: space-around;
    margin-right: 20px;
`;


// 육각형 그래프 내용1
const charmingData = {
    labels: ['감독연출', '스토리', '영상미', '배우연기', 'OST'], datasets: [{
        label: 'Scores',
        data: [60, 70, 80, 85, 70],
        backgroundColor: 'rgb(19,81,249,0.2)',
        pointBorderColor: ['rgb(255, 133, 179)', 'rgb(254, 196, 70)', 'rgb(142, 189, 255)', 'rgb(100, 169, 178)', 'rgb(178, 103, 183)',],
        pointBorderWidth: 4,
        borderColor: '#1351f9',
        chartArea: {
            backgroundColor: 'rgba(255, 255, 255,1)',
        },
    },],
};


// 육각형 그래프 내용2
//emotionData
const emotionData = {
    labels: ['스트레스 해소', '무서움', '현실감', '몰입감', '긴장감'], datasets: [{
        label: 'Scores',
        data: [30, 60, 44, 83, 71],
        backgroundColor: 'rgb(19,81,249,0.2)',
        pointBorderColor: ['rgb(255, 133, 179)', 'rgb(254, 196, 70)', 'rgb(142, 189, 255)', 'rgb(100, 169, 178)', 'rgb(178, 103, 183)',],
        pointBorderWidth: 4,
        borderColor: '#1351f9',
    },],
};


const labelFont = {
    scales: {
        r: {
            pointLabels: {
                font: {
                    size: 18, family: 'SUIT-Regular',
                },
            },
        },
    },
    chartArea: {
        backgroundColor: 'rgba(255, 255, 255,1)',
    },
};

export default CharmingGraph;
