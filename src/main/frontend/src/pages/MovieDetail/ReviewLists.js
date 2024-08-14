import React from 'react';
import styled from 'styled-components';



//ReviewLists
const ReviewLists = props => {
    //변수
    const { userName, charmingPoint, emotionalPoint, userReview } = props;

    //HTML
    return (
        <ReviewCommentBox>
            <UserName>🟣 {userName}</UserName>
            <CheckboxGraphTitle>
                ✨ 이 영화의 매력은 {charmingPoint.join(',')}
            </CheckboxGraphTitle>
            <CheckboxGraphTitle>
                ✨ {emotionalPoint.join(', ')} 대박!
            </CheckboxGraphTitle>
            <ReviewText>&#10077; {userReview} &#10078;</ReviewText>
            <DateFooter>2023-02-01</DateFooter>
        </ReviewCommentBox>
    );
};

const DateFooter = styled.div`
  font-size: 13px;
`;
const UserName = styled.span`
  font-weight: 600;
`;

const CheckboxGraphTitle = styled.footer`
  color: #57565c;
  margin-top: 10px;
`;
const ReviewCommentBox = styled.div`
  padding: 20px;
  width: 380px;
  height: 250px;
  border: 2px solid #9971ff;
  border-radius: 10px;
  margin: 10px 10px 20px 10px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.5);
`;

const ReviewText = styled.p`
  margin-top: 10px;
  border-top: 3px solid #f1f1f3;
  padding-top: 10px;
  height: 120px;
  word-break: break-all;
`;

export default ReviewLists;
