import React, { useState, useEffect } from 'react';
import axios from "axios";
import YouTube from "react-youtube";
import logo from  "./images/logo_ci.svg"
import profile from  "./images/profile.png"


// css
import "./css/MovieTab.css"



// ■MovieTab (리뷰)
function MovieTab({ movieId, movieDetail, memRole, correspondMemName, correspondMemNum }) {
    const [activeTab, setActiveTab] = useState('reviews');
    const [totalReviews, setTotalReviews] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({content: '', rating: 5});
    const [reviewContent, setReviewContent] = useState('')
    const [editingReview, setEditingReview] = useState(null);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState([]);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [hasNext, setHasNext] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            fetchReviews(token, 1);
        }
    }, [movieId]);


    const fetchReviews = async (token, page = 1) => {
        try {
            const response = await axios.get(`/user/movies/detail/${movieId}/reviews?page=${page}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            // console.log('Fetched review data:', response.data);
            setReviews(response.data.reviews);
            setTotalReviews(response.data.totalReviews);
            setAverageRating(response.data.averageRating);
            setCurrentPage(response.data.currentPage);
            setPageNumbers(response.data.pageNumbers);
            setHasPrevious(response.data.hasPrevious);
            setHasNext(response.data.hasNext);
        } catch (error) {
            // console.error('리뷰를 가져오는 중 오류 발생:', error);
            setError('리뷰를 불러오는데 실패했습니다.');
        }
    };

    // const handleReviewCharsWithLimit = (e) => {
    //     const content = e.target.value;
    //     if (content.length <= 50) {
    //         setNewReview(prevState => ({...prev, content: content}));
    //     } else {
    //         alert("리뷰는 50자 이내로 작성해야 합니다.")
    //     }
    // };

    const handleEditClick = (review) => {
        setNewReview({
            content: review.reviewContent,
            rating: review.reviewRating
        });
        setEditingReviewId(review.reviewId);
    };

    const handleSubmitReview = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            if (editingReviewId) {
                await axios.put(`/user/movies/detail/${movieId}/reviews/${editingReviewId}`, {
                    reviewContent: newReview.content,
                    reviewRating: newReview.rating
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
                setEditingReviewId(null);
            } else {
                await axios.post(`/user/movies/detail/${movieId}/reviews`, {
                    reviewContent: newReview.content,
                    reviewRating: newReview.rating
                }, {
                    headers: {'Authorization': `Bearer ${token}`}
                });
            }
            setNewReview({content: '', rating: 0});
            await fetchReviews(token, currentPage);
            alert(editingReviewId ? '리뷰가 수정되었습니다.' : '리뷰가 작성되었습니다.');
        } catch (error) {
            // console.error('리뷰 작성/수정 중 오류 발생:', error);
            if (error.response && error.response.data) {
                alert(error.response.data);
            } else {
                alert('리뷰 작성/수정에 실패했습니다. 다시 시도해 주세요.');
            }
        }
    };


    const handleDeleteReview = async (reviewId) => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.delete(`/user/movies/detail/${movieId}/reviews/${reviewId}`, {
                headers: {'Authorization': `Bearer ${token}`}
            });
            await fetchReviews(token, currentPage);
            alert('리뷰가 삭제되었습니다.');
        } catch (error) {
            // console.error('리뷰 삭제 중 오류 발생:', error);
            alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };


    //html ---------------------------------------------------------
    return (
        <>
            <div className='tabDiv'>
                <div className="tabs">

                    {/*01.현재 작성자*/}
                    <button onClick={() => setActiveTab('reviews')}
                            className={activeTab === 'reviews' ? 'active' : ''}>
                        관람에 대한 이야기를 남겨주세요&nbsp;&nbsp;|&nbsp;&nbsp;현재 작성자({totalReviews})
                    </button>
                </div>


                {/*02.최신순*/}
                <div className="movie-sorting-right">
                    <span><button type="button" className="btn orderBtn on" data-cd="">
                        최신순<p className="span">▼</p></button></span>
                </div>

                {/*03.전체*/}
                {/*<div className="movie-sorting-left">*/}
                {/*    <span><button type="button" className="btn orderBtn on" data-cd="">*/}
                {/*        전체</button></span>*/}
                {/*</div>*/}


                {/*04.로고+ 평균평점 안내 박스*/}
                <div className="box">
                <div className="logobox">
                    <img src={logo}></img>
                    <p className="logoname">ROCK</p>
                </div>
                <div className="average">
                    <p className="rating">
                        <mark>평균 평점 [ {averageRating.toFixed(1)} / 5 ]
                            </mark>
                                <br/>
                                재미있게 보셨나요? 영화의 어떤 점이 좋았는지 이야기해주세요.
                    </p>
                </div>
                </div>



                {/*05.리뷰 작성 및 외 박스*/}
                {activeTab === 'reviews' && (
                    <div className="tabDiv">
                        {/*에러 박스*/}
                        {error && <p className="error">{error}</p>}

                        {/*리뷰 작성 박스*/}
                        <form
                            className="review-input"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmitReview();
                            }}
                        >


                            {/*왼쪽 - 프로필*/}
                            <div className="profile">
                                <img src={profile}></img>
                            </div>

                            {/*오른쪽- 리뷰박스*/}
                            <textarea
                                className="textarea"
                                value={newReview.content}
                                // onChange={handleReviewCharsWithLimit}
                                onChange={(e) => setNewReview({...newReview, content: e.target.value})}
                                placeholder="리뷰를 작성해주세요. (50자 이내)"
                                // maxLength={50}
                                required
                            />

                            {/*오른쪽- 평점 스핀박스*/}
                            <input
                                type="number"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                min="1"
                                max="5"
                                required
                            />


                            <button type="submit">
                                {editingReviewId ? '리뷰 수정' : '리뷰 작성'}
                            </button>


                            {editingReviewId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingReviewId(null);
                                        setNewReview({content: '', rating: 5});
                                    }}
                                >
                                    취소
                                </button>
                            )}
                        </form>

                        {reviews.length > 0 ? (
                            <>
                                <ul className="review_ul">
                                    {reviews.map((review) => (
                                        <li key={review.reviewId} className="review-item">
                                            {/*{console.log('Review:', review, 'correspondMemNum:', correspondMemNum, 'memRole:', memRole)}*/}
                                            <span className="reviewWriter">{review.memName}</span>
                                            <span className="reviewContent">{review.reviewContent}</span>
                                            <span className="reviewTime">
                                            {review.modifyDate && review.modifyDate !== review.createDate
                                                ? `수정됨: ${review.modifyDate}`
                                                : `작성: ${review.createDate}`}
                                        </span>
                                            <span className="reviewStar">{review.reviewRating}/5</span>
                                            <div className="review_actions">
                                                {(correspondMemNum && Number(review.memNum) === Number(correspondMemNum)) && (
                                                    <button onClick={() => handleEditClick(review)}>수정</button>
                                                )}
                                                {((memRole === 'ADMIN') || (correspondMemNum && Number(review.memNum) === Number(correspondMemNum))) && (
                                                    <button
                                                        onClick={() => handleDeleteReview(review.reviewId)}>삭제</button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
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
                            <p>아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!</p>
                        )}
                    </div>
                )}


                {activeTab === 'trailer' && (
                    <div className="trailer">
                        {movieDetail.trailers && movieDetail.trailers.length > 0 ? (
                            <YouTube
                                videoId={movieDetail.trailers[0].trailerUrls.split('v=')[1]}
                                opts={{
                                    width: '100%',
                                    height: '500px',
                                    playerVars: {
                                        autoplay: 0,
                                        rel: 0,
                                        modestbranding: 1,
                                        controls: 1,
                                    },
                                }}
                                onReady={(event) => {
                                    event.target.playVideo();
                                }}
                                onEnd={(event) => {
                                    event.target.stopVideo();
                                }}
                            />
                        ) : (
                            <p>예고편이 없습니다.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default MovieTab;