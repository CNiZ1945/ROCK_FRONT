import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenChecker = () => {
    const [seconds, setSeconds] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('accessToken');
            console.log(`Token check at ${seconds} seconds: ${token}`);

            if (!token) {
                alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
                // localStorage.removeItem('accessToken');
                navigate("/login");
            }
        };

        // 초기 토큰 체크
        checkToken();

        // 1초마다 seconds 값을 증가시키며 로그 찍기
        const logInterval = setInterval(() => {
            setSeconds(prevSeconds => {
                const newSeconds = prevSeconds + 1; // 1초 단위로 증가
                console.log(`Elapsed time: ${newSeconds} seconds`);
                return newSeconds;
            });
        }, 1000); // 1초마다 실행

        // 1분마다 토큰 체크
        const tokenCheckInterval = setInterval(() => {
            checkToken(); // 매분마다 토큰 체크
        }, 1000 * 60); // 1분마다 실행

        // 컴포넌트 언마운트 시 인터벌 클리어
        return () => {
            clearInterval(logInterval);
            clearInterval(tokenCheckInterval);
        };
    }, [seconds, navigate]); // seconds와 navigate를 의존성으로 설정

    return <div>TokenChecker is active</div>; // 컴포넌트가 렌더링되는지 확인
};

export default TokenChecker;
