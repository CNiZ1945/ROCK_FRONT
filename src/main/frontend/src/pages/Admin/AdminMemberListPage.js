import React, { useState, useEffect } from "react";
// import axios from "axios";
import './css/AdminMemberList.css';
import { api } from "../../api/axios";
import styled from "styled-components"
import SideBar from "./SideBar";

//img
import home from "./images/home.svg";

function AdminMemberListPage() {

    const [members, setMembers] = useState([]);

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedMembers, setSelectedMembers] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchMembers();
    }, [currentPage]);

    // 회원 목록 가져오는 로직
    const fetchMembers = async () => {
        try {
            const response = await api.get(`/admin/members?page=${currentPage}&size=15`);
            setMembers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    // 회원 검색 로직
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/admin/members/search?term=${searchTerm}`);
            setMembers(response.data);
        } catch (error) {
            console.error("Error searching members:", error);
            alert("회원 검색 중 에러가 발생했습니다");
        }
    };

    // 전체 선택 체크박스 핸들러
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedMembers(members.map(member => member.memNum));
        } else {
            setSelectedMembers([]);
        }
    };

    // 개별 체크박스 핸들러
    const handleCheckboxChange = (memNum) => {
        setSelectedMembers(prev => {
            const newSelection = prev.includes(memNum)
                ? prev.filter(id => id !== memNum)
                : [...prev, memNum];

            setSelectAll(newSelection.length === members.length);
            return newSelection;
        });
    };

    // 회원 탈퇴 로직
    const handleDeleteMembers = async () => {
        if (window.confirm("선택한 회원을 삭제하시겠습니까?")) {
            try {
                const membersToDelete = members
                    .filter(member => selectedMembers.includes(member.memNum))
                    .map(member => member.memId);

                const response = await api.post("/admin/members/delete", membersToDelete);

                // 서버 응답 처리
                if (response.data.deletedMembers && response.data.failedToDeleteMembers) {
                    let message = "";
                    if (response.data.deletedMembers.length > 0) {
                        message += `다음 회원들이 삭제되었습니다: ${response.data.deletedMembers.join(", ")}\n`;
                    }
                    if (response.data.failedToDeleteMembers.length > 0) {
                        message += `다음 회원들은 삭제할 수 없습니다 (관리자 권한): ${response.data.failedToDeleteMembers.join(", ")}`;
                    }
                    alert(message);
                } else {
                    alert(response.data);
                }

                // 회원 목록을 다시 불러오고, 선택 상태 초기화
                await fetchMembers();
                setSelectedMembers([]);
                setSelectAll(false);  // 전체 선택 상태도 해제
            } catch (error) {
                console.error("회원 삭제 중 오류 발생:", error.response?.data || error.message);
                alert(`회원 삭제 중 오류가 발생했습니다: ${error.response?.data || error.message}`);
            }
        }
    };

    return (
        <>
            {/* 배경 wrap*/}
            <div className="wrap" >
                {/* sidebar */}
                <SideBar />
                {/*3.상단 브레드스크럼 메뉴바*/}
                {/*3-1.상단 브레드스크럼 메뉴바*/}
                <div className="admin_head">
                    <img src={home}></img>
                    <h2>관리자페이지</h2>
                </div>
                {/*3-2.상단 브레드스크럼 메뉴바*/}
                <div className="admin_movie_head">
                    <span>Admin&nbsp;&nbsp;{">"}&nbsp;&nbsp;회원 관리&nbsp;&nbsp;</span>
                    {/*<span className="s">></span>*/}
                </div>

                <div className="admmin_member_search_div">
                    <div className="member_search_form">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="회원 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" value="검색" />
                        </form>
                    </div>
                    <div className="member_edit_btn">
                        <DeleteButton onClick={handleDeleteMembers}>회원 삭제</DeleteButton>
                    </div>
                </div>

                {/* 검색 */}
                <FormBox onSubmit="">
                    {/* 검색창 */}
                    <SearchInput
                        type="text"
                        className="bottom_search_text"
                        placeholder="검색어 입력"
                        // onChange={handleSearchInput}
                    />
                    {/* 검색 버튼 */}
                    <Button
                        className="search_submit"
                        type="submit">
                            검색
                        </Button>

                </FormBox>


                <div className="list_div">
                    <div className="admin_member_haed">
                        <h2>회원 관리</h2>
                    </div>
                    <div className="admin_member_list">
                        <div>
                            <ul className="list content">
                                <li className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </li>
                                <li className="mem_no">회원 번호</li>
                                <li className="mem_id">회원 ID</li>
                                <li className="mem_name">이름</li>
                                <li className="mem_email">이메일</li>
                                <li className="mem_phone">연락처</li>
                                <li className="mem_gender">성별</li>
                                <li className="mem_birth">생년월일</li>
                                <li className="mem_role">권한</li>
                            </ul>
                        </div>
                        <div>
                            {members.map((member) => (
                                <ul className="list" key={member.memNum}>
                                    <li className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedMembers.includes(member.memNum)}
                                            onChange={() => handleCheckboxChange(member.memNum)}
                                        />
                                    </li>
                                    <li className="mem_no">{member.memNum}</li>
                                    <li className="mem_id">{member.memId}</li>
                                    <li className="mem_name">{member.memName}</li>
                                    <li className="mem_email">{member.memEmail}</li>
                                    <li className="mem_phone">{member.memTel}</li>
                                    <li className="mem_gender">{member.memGender}</li>
                                    <li className="mem_birth">{member.memBirth}</li>
                                    <li className="mem_role">{member.memRole}</li>
                                </ul>
                            ))}
                        </div>
                    </div>

                    <div className="list_number">
                        <ul className="list_number_ul">
                            <li onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}>&lt;</li>
                            {[...Array(totalPages).keys()].map((number) => (
                                <li key={number} onClick={() => setCurrentPage(number)}>{number + 1}</li>
                            ))}
                            <li onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}>&gt;</li>
                        </ul>
                    </div>


                </div>
            </div>

        </>
    );
}


export default AdminMemberListPage;




const DeleteButton = styled.button`

        display: flex;
        justify-content: center;
    align-items: center;
    font-family: 'SUIT-Regular' !important;
    font-size: 20px;
    font-weight: 600;
    // padding-top: 74px;
    text-align: center;
    margin: 0 auto;
    // margin-bottom: 48px;
        color: white;
        width: 90px;
        height: 50px;
        // margin-right: 20px;
        border: 1px solid #cccccc;
        border-radius: 2px;
        background-color: red;
        // position: relative;
        
`



// 검색창 전체 폼
const FormBox = styled.form`
  width: 1044px;
    display: flex;
`;

//Select
const Select = styled.select`
    width: 200px;
    outline: none;
    font-size: 16px;
    text-indent: 10px;
    color: #000;
    border: none;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
    margin-right: 20px;
`;

//옵션
const Option = styled.option`
    background-color: transparent;
    border: none;
`;


// 검색창 폼
const SearchInput = styled.input`
    display: flex;
    justify-content: center;
    width: 800px;
    margin-right: 20px;
    
    padding-left: 20px;
    border: none;
    outline: none;
    //caret-color: rgb(49, 130, 246);
    font-size: 16px;
    font-weight: 400;
    line-height: 100%;
    color: #333;
    min-height: 32px;
    background-color: transparent;
    border-bottom: 1px solid rgb(176, 184, 193);
`;

//검색 버튼
const Button = styled.button`
    width: 140px;
    height: 45px;
    border: 1px solid #cccccc;
    border-radius: 2px;
    background-color: #e5e8eb;
    float: right;
    font-size: 14px;

    &:hover{
        background-color: #1351f9;
        color: #fff;
    }
    
`;


