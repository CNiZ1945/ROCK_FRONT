import React, { useState } from 'react';
import styled from 'styled-components';
import Checkbox from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import ReviewLists from './ReviewLists';
import CharmingGraph from './CharmingGraph';
import { api } from '../../api/axios';
import { useEffect } from 'react';


//MovieReview -----------------------------
const MovieReview = ({ movieId, movieDetail, memRole, correspondMemName, correspondMemNum }) => {

    // 변수 설정
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({ content: '', rating: 5 });
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [charmingPoint, setCharmingPoint] = useState([]);
    const [emotionalPoint, setEmotionalPoint] = useState([]);
    const [attractionPoints, setAttractionPoints] = useState({
        directingPoint: false,
        actingPoint: false,
        visualPoint: false,
        storyPoint: false,
        ostPoint: false
    });
    const [emotionPoints, setEmotionPoints] = useState({
        stressReliefPoint: false,
        scaryPoint: false,
        realityPoint: false,
        immersionPoint: false,
        tensionPoint: false
    });

    const [isLike, setIsLike] = useState(false);
    const [likeCounts, setLikeCounts] = useState({});
    const [reviewLikes, setReviewLikes] = useState({});
    const [sortBy, setSortBy] = useState('latest');
    const [chartImages, setChartImages] = useState({
        gender: null,
        age: null,
        attraction: null,
        emotion: null
    });

    // 차트 이미지
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchReviews(token, 1);
            fetchInitialLikeStatuses(token);
            fetchMovieChartImages();
        }

        // 컴포넌트가 언마운트될 때 실행될 cleanup 함수
        return () => {
            // 컴포넌트가 언마운트될 때 이미지 삭제 요청을 보냅니다.
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
                    .catch((error) => {
                        console.error('Error deleting images:', error);
                    });
            }
        };
    }, [movieId, sortBy]);

    // 차트 이미지 불러오기
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


    // 정렬 방식을 변경하는 함수
    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        // fetchReviews(localStorage.getItem('accessToken'), 1, newSortBy);
    };

    // 리뷰 불러오기 
    const fetchReviews = async (token, page = 1) => {
        try {
            const response = await api.get(`/user/movies/detail/${movieId}/reviews?page=${page}&sortBy=${sortBy}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data;
            // console.log('Fetched review data:', response.data);
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalReviews);
            setAverageRating(response.data.averageRating);
            setCurrentPage(response.data.currentPage);
            setPageNumbers(response.data.pageNumbers);
            setHasPrevious(response.data.hasPrevious);
            setHasNext(response.data.hasNext);
        } catch (error) {
            console.error('리뷰를 가져오는 중 오류 발생:', error);
            setError('리뷰를 불러오는데 실패했습니다.');
        }
    };

    // 리뷰 수정 버튼
    const handleEditClick = (review) => {
        setNewReview({
            content: review.reviewContent,
            rating: review.reviewRating
        });
        setEditingReviewId(review.reviewId);
    };

    // 리뷰 매력 포인트 구성
    const handleAttractionPointChange = (e) => {
        setAttractionPoints({ ...attractionPoints, [e.target.name]: e.target.checked });
    };

    // 리뷰 감점 포인트 구성
    const handleEmotionPointChange = (e) => {
        setEmotionPoints({ ...emotionPoints, [e.target.name]: e.target.checked });
    };

    // 리뷰 submit 관리
    const handleSubmitReview = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const reviewData = {
                reviewContent: newReview.content,
                reviewRating: newReview.rating,
                attractionPoints: attractionPoints,
                emotionPoints: emotionPoints
            };
            if (isValid) {

                if (editingReviewId) {
                    await api.put(`/user/movies/detail/${movieId}/reviews/${editingReviewId}`, reviewData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setEditingReviewId(null);
                } else {
                    await api.post(`/user/movies/detail/${movieId}/reviews`, reviewData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
                setNewReview({ content: '', rating: 5 });
                setAttractionPoints({ directingPoint: false, actingPoint: false, visualPoint: false, storyPoint: false, ostPoint: false });
                setEmotionPoints({ stressReliefPoint: false, scaryPoint: false, realityPoint: false, immersionPoint: false, tensionPoint: false });
                await fetchReviews(token, currentPage);
                alert(editingReviewId ? '리뷰가 수정되었습니다.' : '리뷰가 작성되었습니다.');

            }

        } catch (error) {
            if (error.response && error.response.data) {
                console.error("review submit error:", error.response.data);

                alert("review submit error:", error.response.data);
            } else {
                alert('리뷰 작성/수정에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };

    // 리뷰 글자 수 유효성 검사
    const handleValidationAndSubmit = () => {
        if (newReview.content.length >= 4 && newReview.content.length <= 50) {
            setIsValid(true); // 유효한 상태
            handleSubmitReview(); // 제출 처리
        } else {
            alert("리뷰는 4자 이상, 50자 이하로 쓰셔야 합니다");
            setIsValid(false); // 유효하지 않은 상태
        }
    };

    

    // 리뷰 delete 관리
    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await api.delete(`/user/movies/detail/${movieId}/reviews/${reviewId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const { currentPage: newPage, totalReviews: newTotalReviews } = response.data;

            //즉시 상태 업데이트
            setReviews(prevReviews => prevReviews.filter(review => review.reviewId !== reviewId));
            setTotalReviews(newTotalReviews);

            // 현재 페이지의 리뷰 수 계산
            const currentPageReviewCount = reviews.length - 1;

            // 삭제 후 페이지 결정
            let pageToFetch;
            if (currentPageReviewCount === 1 && currentPage > 1) {
                // 현재 페이지의 마지막 리뷰를 삭제한 경우, 이전 페이지로 이동
                pageToFetch = currentPage - 1;
            } else {
                // 그 외의 경우, 현재 페이지 유지
                pageToFetch = currentPage;
            }

            setCurrentPage(pageToFetch);
            await fetchReviews(token, pageToFetch);
            // setTotalReviews(newTotalReviews);
            alert('리뷰가 삭제되었습니다.');
        } catch (error) {
            console.error('리뷰 삭제 중 오류 발생:', error);
            alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 리뷰 좋아요 상태 확인
    const fetchInitialLikeStatuses = async (token) => {
        try {
            const response = await api.get(`/user/movies/detail/${movieId}/reviews/likes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const likeStatusArray = response.data; // [{reviewId, memNum, likeCount, like}]
            const initialLikes = {};
            console.log("Like Status:", response.data);

            // 배열을 순회하며 상태를 초기화합니다.
            likeStatusArray.forEach(status => {
                initialLikes[status.reviewId] = {
                    isLike: status.like,
                    likeCount: status.likeCount
                };
            });

            setReviewLikes(initialLikes);
        } catch (error) {
            console.error('초기 좋아요 상태를 가져오는 중 오류 발생:', error);
            setError('좋아요 상태를 불러오는데 실패했습니다.');
        }
    };

    // 리뷰 좋아요 버튼
    const toggleReviewLike = async (reviewId) => {
        const token = localStorage.getItem('accessToken');
        if (!token || !reviewId) {
            console.error('AccessToken 또는 ReviewId가 없습니다');
            return;
        }

        try {
            const currentLikeStatus = reviewLikes[reviewId] || { isLike: false, likeCount: 0 };
            const url = `/user/movies/detail/${movieId}/reviews/${reviewId}/likes`;

            let response;
            if (currentLikeStatus.isLike) {
                response = await api.delete(url, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                    data: { movieId, reviewId }
                });
            } else {
                response = await api.post(url, { movieId, reviewId }, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
            }

            const newLikeStatus = {
                isLike: response.data.like,
                likeCount: response.data.likeCount
            };

            setReviewLikes(prev => ({
                ...prev,
                [reviewId]: newLikeStatus
            }));
        } catch (error) {
            console.error('좋아요 토글 중 오류 발생:', error);
            alert('댓글 좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

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

                            {/* <form> */}
                                <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmitReview();
                            }}>
                                {/*체크박스 컨테이너*/}
                                <CheckboxContainer>
                                    <CheckboxWrap>
                                        <CheckboxGroup
                                            className="CheckboxGroup"
                                            values={charmingPoint}
                                            onChange={setCharmingPoint}>
                                            <SelectPointTitle>❤️ 매력포인트</SelectPointTitle>
                                            {CHARMING_DATA_LIST.map(charmingList => {
                                                return (
                                                    <label key={charmingList.id}>

                                                        <Checkbox
                                                            className="Checkbox"
                                                            name={charmingList.point}
                                                            value={charmingList.title}
                                                            checked={attractionPoints[charmingList.point]}
                                                            onChange={handleAttractionPointChange}
                                                        >
                                                            {charmingList.title}
                                                        </Checkbox>
                                                    </label>
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
                                                    <label>
                                                        <Checkbox
                                                            key={emotionalList.id}
                                                            value={emotionalList.title}
                                                            checked={emotionPoints[emotionalList.point]}
                                                            onChange={handleEmotionPointChange}

                                                        >
                                                            {emotionalList.title}
                                                        </Checkbox>

                                                    </label>
                                                );
                                            })}
                                        </CheckboxGroup>
                                    </CheckboxWrap>
                                </CheckboxContainer>

                                <WriteReview>

                                <ReviewInput
                                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}

                                    //  리뷰 글자 수가 4~50자 이어야 작성 가능
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();  // Enter 눌렀을 때 기본 제출 방지
                                            handleValidationAndSubmit();
                                        }
                                    }}
                                    type="text"
                                    value={newReview.content}
                                    placeholder=" 리뷰 작성 (50자 이내로 작성) "
                                />

                                {/* 평점 스핀박스 */}
                                <InputNumber
                                    type="number"
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                    min="1"
                                    max="5"
                                    required
                                />

                                {/* 등록 버튼 */}
                                <UploadBtn type='submit'  disabled={!isValid}>
                                    등록
                                </UploadBtn>

                                {/* 수정 버튼 */}
                                <EditBtn type='submit'  disabled={!isValid}>
                                    수정
                                </EditBtn>


                            </WriteReview>
                        </form>


                    </ReviewModalContentBox>
                    </ReviewContainer>
                )}

                {/* 리뷰 출력 */}
            {reviews.length > 0 ? (
                <>
                    <button onClick={() => handleSortChange('latest')}
                        className={sortBy === 'latest' ? 'active' : ''}>최신순
                    </button>
                    <button onClick={() => handleSortChange('likes')}
                        className={sortBy === 'likes' ? 'active' : ''}>좋아요순
                    </button>
                    <OnlyReviewContainer>
                        <ReviewTitle> &#62; Review</ReviewTitle>
                        <ReviewCommentContainer>
                            {reviews.map((review) => {

                                // 매력, 감정 포인트를 배열로 만들기
                                const charmingPoints = Array.isArray(review.attractionPoints) ? review.attractionPoints : review.attractionPoints ? [review.attractionPoints] : [];
                                const emotionalPoints = Array.isArray(review.emotionPoints) ? review.emotionPoints : review.emotionPoints ? [review.emotionPoints] : [];

                                return (
                                    <>
                                        {/* 리뷰 리스트 */}
                                        <ReviewLists
                                            key={review.id}
                                            userName={review.memName}
                                            userReview={review.reviewContent}
                                            reviewRating={review.reviewRating}
                                            charmingPoint={charmingPoints}
                                            emotionalPoint={emotionalPoints}
                                        />
                                        <div className="review_actions">
                                            <div className="like_button">
                                                <button
                                                    onClick={() => toggleReviewLike(review.reviewId)}
                                                >
                                                    {reviewLikes[review.reviewId]?.isLike ? '❤️' : '🤍'}
                                                </button>
                                                <span>({reviewLikes[review.reviewId]?.likeCount || 0})</span>
                                            </div>
                                            {(correspondMemNum && Number(review.memNum) === Number(correspondMemNum)) && (
                                                <button onClick={() => handleEditClick(review)}>수정</button>
                                            )}
                                            {((memRole === 'ADMIN') || (correspondMemNum && Number(review.memNum) === Number(correspondMemNum))) && (
                                                <button
                                                    onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                            )}
                                        </div>
                                    </>
                                );
                            })}
                        </ReviewCommentContainer>
                    </OnlyReviewContainer>
                    <div className="pagination">
                        {hasPrevious && (
                            <button
                                onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage - 1)}>
                                &lt;
                            </button>
                        )}
                        {pageNumbers && pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => fetchReviews(localStorage.getItem('accessToken'), number)}
                                className={number === currentPage ? 'active' : ''}
                            >
                                {number}
                            </button>
                        ))}
                        {hasNext && (
                            <button
                                onClick={() => fetchReviews(localStorage.getItem('accessToken'), currentPage + 1)}>
                                &gt;
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div style={{ color: 'white' }}>아직 리뷰가 없습니다. 첫번째 리뷰를 작성해보세요</div>
            )}
        </WholeReviewConstainer >
        </>

        
        
        
 
    );
};

//STYLE -----------------------------------


//그래프 전체 박스 - 그래프 자리
const Wrap = styled.div`
    //사이즈
    width: 100%;
    // height: 500px;
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
//   max-height: 700px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
    // display: flex;
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


// {/*01.현재 작성자*/ }
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
    { id: 1, title: '감독연출', point: 'directingPoint' },
    { id: 2, title: '스토리', point: 'storyPoint' },
    { id: 3, title: '영상미', point: 'visualPoint' },
    { id: 4, title: '배우연기', point: 'actingPoint' },
    { id: 5, title: 'OST', point: 'ostPoint' },
];

//그래프2
const EMOTIOMAL_DATA_LIST = [
    { id: 1, title: '스트레스 해소', point: 'stressReliefPoint' },
    { id: 2, title: '무서움', point: 'scaryPoint' },
    { id: 3, title: '현실감', point: 'realityPoint' },
    { id: 4, title: '몰입감', point: 'immersionPoint' },
    { id: 5, title: '긴장감', point: 'immersionPoint' },
];
