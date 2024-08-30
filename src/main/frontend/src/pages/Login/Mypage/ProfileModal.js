import React, { useEffect, useState } from 'react';
import { DogImg, BirdImg, FishImg, CatImg, TurtleImg, 
    profile1, profile2, profile3, profile4, profile5 } from './ProfileImg';
import styled from 'styled-components';
import { api } from '../../../api/axios';

export default function ProfileModal() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [memberInfo, setMemberInfo] = useState({
        memProfile: '',
    });

    const handleImageSelect = (img) => {
        setSelectedImage(img);
    };

    const fetchMemberInfo = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await api.get('/auth/memberinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
    
            if (response && response.data) {
                setMemberInfo(response.data);
            }
        } catch (error) {
            console.error("회원 정보 가져오기 중 오류 발생:", error);
        }
    };
    
    useEffect(() => {
        fetchMemberInfo();
        console.log("MemberInfo: ", memberInfo);
    }, []);

    // 상태 변경 후 로그 찍기
    useEffect(() => {
        console.log("Updated memberInfo: ", memberInfo);
    }, [memberInfo]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = localStorage.getItem('accessToken');
    
            if (selectedImage) {
                const response = await api.put('/auth/update', {
                    memNewProfile: selectedImage, // 선택된 이미지 URL을 서버에 전송
                    // 필요한 경우 다른 필드도 포함
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                });
    
                if (response.status === 200) {
                    alert("프로필 이미지가 성공적으로 업데이트되었습니다.");
                } else {
                    alert("업데이트 실패: " + response.statusText);
                }
            } else {
                alert("이미지를 선택해주세요.");
            }
        } catch (error) {
            console.error("프로필 이미지 업데이트 중 오류 발생:", error);
            alert("프로필 이미지 업데이트 중 오류가 발생했습니다.");
        }
    };
    
    

    return (
        <ProfileModalWrap>
            <form onSubmit={handleSubmit}>
                <ImageSelectWrap>
                    {[profile1, profile2, profile3, profile4, profile5, DogImg, BirdImg, FishImg, CatImg, TurtleImg].map((img, index) => (
                        <ProfileImg 
                            key={index} 
                            src={img} 
                            onClick={() => handleImageSelect(img)}
                            isSelected={selectedImage === img} // 선택된 이미지에 스타일 적용
                        />
                    ))}
                </ImageSelectWrap>
                <SubmitButton type="submit">변경 하기</SubmitButton>
            </form>
        </ProfileModalWrap>
    );
}

const ProfileModalWrap = styled.div`
    width: 600px;
    height: 200px;
    position: absolute;
    top: 10%;
    left: 26%;
    border: 1px solid red;
    display: flex;
    justify-content: center;
    align-items: center;

    form{
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const ImageSelectWrap = styled.div`
    width: 400px;
    height: 150px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    border: 1px solid blue;
    margin-right: 10px;
`;

const ProfileImg = styled.img`
    width: 70px;
    height: 70px;
    cursor: pointer;
    border: ${(props) => (props.isSelected ? '3px solid blue' : '1px solid #ccc')};
    border-radius: 5px;
    &:hover {
        border: 3px solid blue;
    }
`;

const SubmitButton = styled.button`
    width: 100px;
    height: 40px;
    margin-top: 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;
