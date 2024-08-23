import React from 'react';
import styled from 'styled-components';
import CheckBoxContext from './CheckBoxContext';



//ReviewLists
const ReviewLists = props => {
    //변수
    const { userName, reviewRating ,charmingPoint, emotionalPoint, userReview, reviewTime } = props;
    
    //HTML
    return (
        <ReviewCommentBox>
            <UserName>🟣 {userName}</UserName>
            <CheckboxGraphTitle>
                🌟 별점 {reviewRating}
            </CheckboxGraphTitle>
           {/* charmingPoint가 존재할 경우에만 렌더링 */}
           {charmingPoint && (
                <CheckboxGraphTitle>
                    ✨ 이 영화의 매력은 {charmingPoint.join(', ')}
                </CheckboxGraphTitle>
            )}
            
            <CheckboxGraphTitle>
                ✨ {emotionalPoint.join(', ')} 대박!
            </CheckboxGraphTitle>
            <ReviewText>&#10077; {userReview} &#10078;</ReviewText>
            <DateFooter>{reviewTime}</DateFooter>
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
  background: white;
  // padding: 5px;
  padding: 10px;
  width: 380px;
  // height: 210px;
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
