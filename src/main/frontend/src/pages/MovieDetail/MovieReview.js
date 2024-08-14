import React, { useState } from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import ReviewLists from './ReviewLists';
import CharmingGraph from './CharmingGraph';


//MovieReview -----------------------------
const MovieReview = () => {

    //변수
    const [editingReview, setEditingReview] = useState(null);
    const [reviewContent, setReviewContent] = useState('')
    const [newReview, setNewReview] = useState({content: '', rating: 5});
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [charmingPoint, setCharmingPoint] = useState([]);
    const [emotionalPoint, setEmotionalPoint] = useState([]);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [inputComment, setInputComment] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [reviewComments, setReviewComments] = useState([]);


    //post-리뷰 코멘트
    const post = () => {
        setReviewComments(prevState => {
            return [inputComment, ...prevState];
        });
        setInputComment('');
        setOpenReviewModal(false);
    };

    //InputChange-작성폼
    const InputChange = e => {
        setInputComment(e.target.value);
    };
    const userName = '관객아이디';



    //HTML
    return (
        <>
            {/*그래프 자리*/}
            <Wrap>
                <CharmingGraph />
            </Wrap>
        <WholeReviewConstainer>

            <ReviewInfoBox>
                <div className="infoText">
                    <BoxText>🎁   관람에 대한 이야기를 남겨주세요&nbsp;&nbsp;|&nbsp;&nbsp;✎ 현재 작성자&nbsp;({totalReviews})</BoxText>

                    <p className="average">
                        <ReviewCount>평균 평점 [ {averageRating.toFixed(1)} / 5 ]</ReviewCount>
                        <ReviewCounts>재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.</ReviewCounts>
                    </p>
                </div>
                <OpenReviewBtn
                    onClick={() => {
                        setOpenReviewModal(!openReviewModal);
                    }}
                >
                    &nbsp;✎ 관람평 쓰기&nbsp;
                </OpenReviewBtn>
            </ReviewInfoBox>
            {openReviewModal && (
                <ReviewContainer>
                    <ReviewModalTitle>
                        <ReviewModalTitle>Review&nbsp;&nbsp;
                            <span className="ReviewModalTitle">아직 리뷰가 없습니다.&nbsp;&nbsp;첫번째 작성자가 되어주세요!</span>
                        </ReviewModalTitle>
                        <CloseReviewBtn
                            onClick={() => {
                                setOpenReviewModal(false);
                            }}
                        >
                            X
                        </CloseReviewBtn>
                    </ReviewModalTitle>
                    <ReviewModalContentBox>
                        <ReviewModalInfoBox>
                            <ReviewTitleText>
                                &nbsp; &nbsp;당신만의 관람 포인트 선택해주세요!&nbsp;&nbsp;
                            </ReviewTitleText>
                            <SelectAgainText>
                                중복선택
                                <span className="SelectAgainText">도 가능합니다.</span>
                            </SelectAgainText>

                            {/*평점 등록*/}
                            <SelectAgainTexts>
                                리뷰 작성 시,<span className="SelectAgainTexts">평점</span>을 등록해주세요
                            </SelectAgainTexts>

                        </ReviewModalInfoBox>


                        {/*체크박스 컨테이너*/}
                        <CheckboxContainer>
                            <CheckboxWrap>
                                <CheckboxGroup
                                className="CheckboxGroup"
                                values={charmingPoint} onChange={setCharmingPoint}>
                                <SelectPointTitle>❤️ 매력포인트</SelectPointTitle>
                                {CHARMING_DATA_LIST.map(charmingList => {
                                    return (

                                        <Checkbox
                                            className="Checkbox"
                                            key={charmingList.id}
                                            value={charmingList.title}>
                                            {charmingList.title}
                                        </Checkbox>
                                    );
                                })}
                                </CheckboxGroup>
                            </CheckboxWrap>
                            <br />


                            <CheckboxWrap>
                                <CheckboxGroup
                                values={emotionalPoint}
                                onChange={setEmotionalPoint}
                            >
                                <SelectPointTitle>😳 감정 포인트</SelectPointTitle>
                                {EMOTIOMAL_DATA_LIST.map(emotionalList => {
                                    return (
                                        <Checkbox
                                            key={emotionalList.id}
                                            value={emotionalList.title}
                                        >
                                            {emotionalList.title}
                                        </Checkbox>
                                    );
                                })}
                                </CheckboxGroup>
                            </CheckboxWrap>
                        </CheckboxContainer>


                        <WriteReview>
                            <ReviewInput
                                onChange={InputChange}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        post();
                                    }
                                }}
                                onKeyUp={e => {
                                    e.target.value.length > 4
                                        ? setIsValid(true)
                                        : setIsValid(false);
                                }}
                                type="text"
                                value={inputComment}
                                placeholder=" 리뷰 작성 (50자 이내로 작성) "
                            />

                            {/*오른쪽- 평점 스핀박스*/}
                            <InputNumber
                                type="number"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                min="1"
                                max="5"
                                required
                            />

                            {/*등록 버튼*/}
                            <UploadBtn onClick={post} disabled={isValid ? false : true}>
                                등록
                            </UploadBtn>

                            {/*수정 버튼*/}
                            <EditBtn onClick="{}" disabled={isValid ? false : true}>
                                수정
                            </EditBtn>

                        </WriteReview>
                    </ReviewModalContentBox>
                </ReviewContainer>
            )}
            {/*<OnlyReviewContainer>*/}
            {/*    <ReviewTitle> &#62; Review</ReviewTitle>*/}
            {/*    <ReviewCommentContainer>*/}
            {/*        {reviewComments.map(reviews => {*/}
            {/*            return (*/}
            {/*                <ReviewLists*/}
            {/*                    key={reviews.id}*/}
            {/*                    userName={userName}*/}
            {/*                    userReview={reviews}*/}
            {/*                    charmingPoint={charmingPoint}*/}
            {/*                    emotionalPoint={emotionalPoint}*/}
            {/*                />*/}
            {/*            );*/}
            {/*        })}*/}
            {/*    </ReviewCommentContainer>*/}
            {/*</OnlyReviewContainer>*/}
        </WholeReviewConstainer>
        </>
    );
};

//STYLE -----------------------------------


//그래프 전체 박스 - 그래프 자리
const Wrap = styled.div`
    //사이즈
    width: 100%;
    height: 500px;
    margin: 0 auto;
    margin-top: 80px;
    padding-top: 40px;
    margin-bottom: 40px;
    
    border-radius: 12px;
    
    //디자인
    //background-color: rgba(255, 255, 255, 0.1);
    background-color:#fff;

`;
//리뷰 박스
const OnlyReviewContainer = styled.div`
  padding: 20px;
`;

//모든 체크 박스
const CheckboxContainer = styled.div`
  margin-left: 60px;
    margin: 0 auto;
  
    
    input{
        width: 18px;
        height: 18px;
        margin-right: 5px;
        font-size: 16px;
        text-align: center;
        align-items: center;
        
    }
`;

//스핀박스
const InputNumber = styled.input`
    width: 100px;
    height: 60px;
    border: none;
    border-bottom: 1px solid #000;
    margin-right: 20px;
    margin-top: 20px;
    background-color: transparent;
    outline: none;
    text-align: left;
    color: #000;
    font-size: 16px;
    font-weight: 600;
    
    &:hover{
        cursor: pointer;
    }
`;

//체크박스 감싸는 전체 박스
const CheckboxWrap = styled.div`
display: flex;
    //width: 600px;
    //height: 80px;
    text-indent: 10px;
    cursor: pointer;
    //디자인
    padding-bottom: 10px;
`;


//등록버튼
const UploadBtn = styled.button`
  // 디자인
  width: 100px;
    height: 60px;
  background-color: #1351f9;
    margin-right: 20px;
    margin-top: 20px;
  border-radius: 12px;
    
  // 폰트스타일
  color: #fff;
  font-weight: 500;
  font-size: 16px;
    text-align: center;
  z-index: 1000;
`;

//수정버튼
const EditBtn = styled.button`
    // 디자인
    width: 100px;
    height: 60px;
    background-color: #ff27a3;
    margin-right: 20px;
    margin-top: 20px;
    border-radius: 12px;

    // 폰트스타일
    color: #fff;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    z-index: 1000;
`;



//리뷰작성 박스
const WriteReview = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
    
`;

//리뷰
const ReviewInput = styled.input`
  border: transparent;
  border-radius: 12px;
  width: 80%;
  line-height: 100px;
  margin-right: 20px;
  font-size: 17px;

  &:focus,
  &:hover {
    border: 2px solid #1351f9;
      outline: none;
  }
`;


const ReviewTitle = styled.p`
  color: #9971ff;
  font-size: 18px;
  font-weight: 600;
  margin: 30px 10px 10px 10px;
`;

const ReviewCommentContainer = styled.div`
  border-top: 2px solid #f1f1f3;
  padding: 20px 20px 0 0px;
  margin: 20px 0 10px 20px;
  width: 100%;
  max-height: 700px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
    display: flex;
    align-items: center;
`;

const CloseReviewBtn = styled.button`
  background-color:#ff27a3;
  border: 1px solid #ff27a3;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  font-size: 18px;
  font-weight: 600;
  color: #1351f9;
  margin-top: 8px;
`;

const ReviewModalContentBox = styled.div`
  padding: 20px;
`;


//당신만의 관람 포인트 선택해주세요!
const ReviewModalInfoBox = styled.header`
    //display: flex;
    //justify-content: left;
    text-align: left;
  padding: 30px 0;
`;

const ReviewModalTitle = styled.div`
  background-color: #1351f9;
  display: flex;
  justify-content: space-between;
  color: #ff27a3;
  font-size: 25px;
  font-weight: 600;
  padding: 6px 10px;
    
    .ReviewModalTitle{
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        text-indent: 10px;
        color: #fff;
    }
`;

const ReviewTitleText = styled.p`
  font-size: 25px;
  font-weight: 600;
  color: #000;
  margin-bottom: 5px;
  display: inline-block;
`;

//평점선택
const SelectAgainTexts = styled.span`
  color: #000;
  font-size: 18px;
  font-weight: 500;
    display: flex;
    flex-wrap: wrap;
  margin-left: 20px;
    
    .SelectAgainTexts{
        color: #ff27a3;
        font-size: 18px;
        font-weight: 500;
        text-indent: 2px;
    }
`;

//중복선택
const SelectAgainText = styled.span`
  color: #1351f9;
  font-size: 18px;
  font-weight: 500;
    display: flex;
    flex-wrap: wrap;
    text-indent: 20px;
    
    
    .SelectAgainText{
        color: #000;
        font-size: 18px;
        font-weight: 500;
        text-indent: 2px;
        
    }
`;

//매력,감정포인트-체크타이틀
const SelectPointTitle = styled.p`
  color: #000;
  font-size: 18px;
  font-weight: 600;
    text-align: left;
    text-indent: 16px;
`;

const ReviewContainer = styled.div`
  
  background-color: #f1f1f3;
  border-radius: 10px;
  margin-top: 20px;
    margin-bottom: 60px;

  /* transition-duration: 1ms; */
`;
const OpenReviewBtn = styled.button`
    width: 120px;
    height: 55px;
    
    font-size: 16px;
    font-weight: 500;
  background-color: #1351f9;
  border: none;
  border-radius: 12px;
  color: #fff;
  transition: all 600ms cubic-bezier(0.86, 0, 0.07, 1);
  cursor: pointer;
    

  &:hover {
    color: #1351f9;
      font-weight: 600;
    border: 2px solid #1351f9;
      background-color: #fff;
  }
`;

const ReviewInfoBox = styled.div`
  background-color: #f1f1f3;
  display: flex;
    align-items: center;
    
  padding: 35px;
  border-radius: 10px;
  -webkit-box-shadow: 17px 23px 25px 5px rgba(0, 0, 0, 0.19);
  box-shadow: 17px 23px 25px 5px rgba(0, 0, 0, 0.19);
  font-weight: 600;
  transition: 0.25s;
    
//평균 평점
    .average{
        width: 1000px;
        height: 84px;
        vertical-align: middle;
        padding-left: 30px;
        text-align: left;
        color: #666;
        line-height: 27px;
    }
`;
const WholeReviewConstainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  //padding: 10px;
`;


{/*01.현재 작성자*/}
const BoxText = styled.p`
    font-size: 20px;
    text-align: center;
    color: #000;
    font-weight: 600;
    display: flex;
    justify-content: left;
    margin-bottom: 20px;
`;

const ReviewCount = styled.p`
  font-size: 17px;
  color: #fff;
  font-weight: 500;
    width: 155px;
    background-color: #ff27a3;
    text-indent: 10px;
`;

const ReviewCounts = styled.p`
  font-size: 17px;
  color: #666;
  font-weight: 600;
`;

export default MovieReview;



//그래프1
const CHARMING_DATA_LIST = [
    { id: 1, title: '감독연출' },
    { id: 2, title: '스토리' },
    { id: 3, title: '영상미' },
    { id: 4, title: '배우연기' },
    { id: 5, title: 'OST' },
];

//그래프2
const EMOTIOMAL_DATA_LIST = [
    { id: 1, title: '스트레스 해소' },
    { id: 2, title: '무서움' },
    { id: 3, title: '현실감' },
    { id: 4, title: '몰입감' },
    { id: 5, title: '긴장감' },
];
