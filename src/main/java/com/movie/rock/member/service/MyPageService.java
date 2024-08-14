package com.movie.rock.member.service;


import com.movie.rock.member.data.*;
import com.movie.rock.movie.data.entity.*;
import com.movie.rock.movie.data.repository.MovieFavorRepository;
import com.movie.rock.movie.data.repository.MovieReviewRepository;
import com.movie.rock.movie.data.repository.MovieWatchHistoryRepository;
import com.movie.rock.movie.data.response.MovieFavorResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsResponseDTO;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MyPageService {


    private final MovieReviewRepository movieReviewRepository;
    private final MovieFavorRepository movieFavorRepository;
    private final MovieWatchHistoryRepository movieWatchHistoryRepository;


    //마이페이지 찜한거 불러오기
    public Page<MyPageFavorResponseDTO> getFavoritesMovies(Long memNum, Pageable pageable) {

        Page<MovieFavorEntity> favoritesPage = movieFavorRepository.findByMemberMemNum(memNum, pageable);

        return movieFavorRepository.findFavoriteMoviesWithMainPoster(memNum, pageable);
    }

    //마이페이지 작성 리뷰 불러오기
    public Page<MyPageReviewResponseDTO> getMyReviews(Long memNum, Pageable pageable) {
        Page<Object[]> results = movieReviewRepository.findByMovieReviewMyPage(memNum, pageable);
        return results.map(this::convertToDTO);
    }

    private MyPageReviewResponseDTO convertToDTO(Object[] result) {
        MovieReviewEntity review = (MovieReviewEntity) result[0];
        MovieEntity movie = (MovieEntity) result[1];
        MoviePostersEntity moviePoster = (MoviePostersEntity) result[2];
        MovieReviewEmotionPointsEntity emotionPoints = (MovieReviewEmotionPointsEntity) result[3];
        MovieReviewAttractionPointsEntity attractionPoints = (MovieReviewAttractionPointsEntity) result[4];

        PostersEntity poster = moviePoster != null ? moviePoster.getPosters() : null;

        return new MyPageReviewResponseDTO(
                review.getReviewId(),
                movie.getMovieId(),
                movie.getMovieTitle(),
                poster != null ? poster.getPosterId() : null,
                poster != null ? poster.getPosterUrls() : null,
                poster != null ? poster.getMainPoster() : null,
                review.getReviewContent(),
                review.getCreateDate(),
                review.getModifyDate(),
                review.getReviewRating(),
                review.getMember().getMemNum(),
                emotionPoints != null ? MovieReviewEmotionPointsResponseDTO.fromEntity(emotionPoints) : null,
                attractionPoints != null ? MovieReviewAttractionPointsResponseDTO.fromEntity(attractionPoints) : null
        );
    }
    public Page<MyPageWatchHistoryResponseDTO> getMyPageWatchHistory(Long memNum, Pageable pageable) {
        Page<MovieWatchHistoryEntity> watchHistoryPage = movieWatchHistoryRepository.findAllByMemNumOrderByDateDescPaged(memNum, pageable);
        return watchHistoryPage.map(this::convertToMyPageWatchHistoryResponseDTO);
    }

    private MyPageWatchHistoryResponseDTO convertToMyPageWatchHistoryResponseDTO(MovieWatchHistoryEntity entity) {
        MovieEntity movie = entity.getMovie();
        MoviePostersEntity mainPoster = getMainPoster(movie);

        return MyPageWatchHistoryResponseDTO.builder()
                .watchId(entity.getWatchId())
                .watchTime(entity.getWatchTime())
                .watchDate(entity.getWatchDate())
                .movieId(movie.getMovieId())
                .movieTitle(movie.getMovieTitle())
                .memNum(entity.getMember().getMemNum())
                .posterId(mainPoster != null ? mainPoster.getPosters().getPosterId() : null)
                .posterUrl(mainPoster != null ? mainPoster.getPosters().getPosterUrls() : null)
                .mainPoster(mainPoster != null && mainPoster.getPosters().getMainPoster())
                .totalDuration(entity.getTotalDuration())
                .build();
    }

    private MoviePostersEntity getMainPoster(MovieEntity movie) {
        return movie.getPoster().stream()
                .filter(poster -> poster.getPosters().getMainPoster())
                .findFirst()
                .orElse(null);
    }
}

//    //작성한 리뷰 페이징
//    public Page<MyPageReviewResponseDTO> getMyPageReviews(Long memNum, Pageable pageable, MemberEntity member) {
//        // memNum과 member.getMemNum()이 일치하는지 확인 (보안 강화)
//        if (!memNum.equals(member.getMemNum())) {
//            throw new IllegalArgumentException("Unauthorized access");
//        }
//
//        Page<MovieReviewEntity> reviewPage = movieReviewRepository.findByMovieReviewMyPage(memNum, pageable);
//
//        return reviewPage.map(reviewEntity -> MyPageReviewResponseDTO.fromEntity(
//                reviewEntity.getMovie(),
//                reviewEntity,
//                reviewEntity.getMovie().getPoster().stream()
//                        .findFirst()
//                        .map(moviePoster -> moviePoster.getPosters())
//                        .orElse(null),
//                reviewEntity.getMember()
//        ));
//    }
//
//
//    //찜한컨텐츠 불러오기
//    public Page<MyPageFavorResponseDTO> getMyFavorList(Long memNum, Pageable pageable, MemberEntity member) {
//        Page<MovieFavorEntity> favorPage = movieFavorRepository.findByMemberMemNum(memNum, pageable);
//
//        return favorPage.map(favorEntity -> {
//            MovieEntity movie = favorEntity.getMovie();
//
//            // 유효한 포스터만 필터링
//            List<MoviePostersEntity> validPosters = movie.getPoster().stream()
//                    .filter(poster -> poster != null && poster.getPosters() != null)
//                    .collect(Collectors.toList());
//
//            // 메인 포스터를 우선적으로 선택하고, 없을 경우 첫 번째 유효한 포스터 사용
//            String posterUrl = validPosters.stream()
//                    .filter(poster -> Boolean.TRUE.equals(poster.getPosters().getMainPoster()))
//                    .findFirst()
//                    .map(poster -> poster.getPosters().getPosterUrls())
//                    .orElseGet(() -> validPosters.stream()
//                            .findFirst()
//                            .map(poster -> poster.getPosters().getPosterUrls())
//                            .orElse(null));
//
//            return MyPageFavorResponseDTO.builder()
//                    .movieId(movie.getMovieId())
//                    .movieTitle(movie.getMovieTitle())
//                    .posterUrls(posterUrl) // 이미 완전한 URL로 설정
//                    .memNum(favorEntity.getMember().getMemNum())
//                    .build();
//        });
//    }
//
//
//
//    //리뷰 삭제
//    @Transactional
//    public void deleteReview(Long reviewId, MemberEntity member) {
//        MovieReviewEntity review = movieReviewRepository.findById(reviewId)
//                .orElseThrow(() -> new IllegalArgumentException("리뷰를 찾을 수 없습니다."));
//
//        if (!review.getMember().getMemNum().equals(member.getMemNum())) {
//            throw new IllegalArgumentException("리뷰를 삭제할 권한이 없습니다.");
//        }
//
//        movieReviewRepository.delete(review);
//    }
//
//
//
//    //시청한 영화목록 불러오기
//    public List<MyPageWatchHistoryResponseDTO> getMyPageWatchHistory(Long memNum, MemberEntity member) {
//        if (!memNum.equals(member.getMemNum())) {
//            throw new IllegalArgumentException("Unauthorized access");
//        }
//
//        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "watchDate"));
//        List<MovieWatchHistoryEntity> watchHistoryList = movieWatchHistoryRepository.findAllByMemNumOrderByDateDesc(memNum, pageable);
//
//        return createWatchHistoryResponseDTOList(watchHistoryList);
//    }
//
//    private List<MyPageWatchHistoryResponseDTO> createWatchHistoryResponseDTOList(List<MovieWatchHistoryEntity> watchHistoryList) {
//        return watchHistoryList.stream()
//                .map(this::createWatchHistoryResponseDTO)
//                .collect(Collectors.toList());
//    }
//
//    private MyPageWatchHistoryResponseDTO createWatchHistoryResponseDTO(MovieWatchHistoryEntity watchHistoryEntity) {
//        MovieEntity movie = watchHistoryEntity.getMovie();
//        MoviePostersEntity mainPoster = getMainPoster(movie);
//
//        return MyPageWatchHistoryResponseDTO.builder()
//                .watchId(watchHistoryEntity.getWatchId())
//                .watchTime(watchHistoryEntity.getWatchTime())
//                .watchDate(watchHistoryEntity.getWatchDate())
//                .movieId(movie.getMovieId())
//                .movieTitle(movie.getMovieTitle())
//                .poster(mainPoster != null ?
//                        new PosterResponseDTO(mainPoster.getPosters().getPosterId(),
//                                mainPoster.getPosters().getPosterUrls(),
//                                mainPoster.getPosters().getMainPoster()) :
//                        null)
//                .totalDuration(watchHistoryEntity.getTotalDuration())
//                .memNum(watchHistoryEntity.getMember().getMemNum())
//                .build();
//    }
//
//    private MoviePostersEntity getMainPoster(MovieEntity movie) {
//        return movie.getPoster().stream()
//                .filter(poster -> poster.getPosters().getMainPoster())
//                .findFirst()
//                .orElse(null);
//    }



//    public List<MyPageWatchHistoryResponseDTO> getMyPageWatchHistory(Long memNum, Pageable pageable, MemberEntity member) {
//        // memNum과 member.getMemNum()이 일치하는지 확인 (보안 강화)
//        if (!memNum.equals(member.getMemNum())) {
//            throw new IllegalArgumentException("Unauthorized access");
//        }
//
//        List<MovieWatchHistoryEntity> watchHistoryPage = movieWatchHistoryRepository.findAllByMemNumOrderByDateDesc(memNum, pageable);
//
//        return watchHistoryPage.stream()
//                .map(watchHistoryEntity -> {
//                    MovieEntity movie = watchHistoryEntity.getMovie();
//
//                    // 유효한 포스터만 필터링
//                    List<MoviePostersEntity> validPosters = movie.getPoster().stream()
//                            .filter(poster -> poster != null && poster.getPosters() != null)
//                            .collect(Collectors.toList());
//
//                    // 메인 포스터를 우선적으로 선택하고, 없을 경우 첫 번째 유효한 포스터 사용
//                    MoviePostersEntity selectedPoster = validPosters.stream()
//                            .filter(poster -> Boolean.TRUE.equals(poster.getPosters().getMainPoster()))
//                            .findFirst()
//                            .orElseGet(() -> validPosters.stream().findFirst().orElse(null));
//
//                    return MyPageWatchHistoryResponseDTO.fromEntity(
//                            watchHistoryEntity,
//                            selectedPoster != null ? selectedPoster.getPosters() : null,
//                            movie,
//                            watchHistoryEntity.getMember()
//                    );
//                })
//                .collect(Collectors.toList());
//    }

//                            MyPageWatchHistoryResponseDTO.fromEntity(
//                            watchHistoryEntity,
//                            posterUrls(posterUrl),
//                            movie,
//                            watchHistoryEntity.getMember()
//                    );
//                })
//                .collect(Collectors.toList());


