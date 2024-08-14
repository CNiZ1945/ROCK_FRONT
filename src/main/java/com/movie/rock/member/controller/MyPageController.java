package com.movie.rock.member.controller;


import com.movie.rock.member.data.MyPageFavorResponseDTO;
import com.movie.rock.member.data.MyPageReviewResponseDTO;
import com.movie.rock.member.data.MyPageWatchHistoryResponseDTO;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.member.service.MyPageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/mypage")
@Slf4j
public class MyPageController {

    private final MyPageService myPageService;

    //마이페이지 찜하기 불러오기
    @GetMapping("/favor")
    public ResponseEntity<?> myPageFavor(
            @PageableDefault(sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        Long memNum = userDetails.getMemNum();
        Page<MyPageFavorResponseDTO> favorList = myPageService.getFavoritesMovies(memNum, pageable);


        return ResponseEntity.ok().body(favorList);
    }

    //마이페이지 시청기록 가져오기
    @GetMapping("/history")
    public ResponseEntity<Page<MyPageWatchHistoryResponseDTO>> getWatchHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long memNum = userDetails.getMemNum();// userDetails에서 memNum을 추출하는 로직

        Pageable pageable = PageRequest.of(page, size, Sort.by("watchDate").descending());
        Page<MyPageWatchHistoryResponseDTO> watchHistory = myPageService.getMyPageWatchHistory(memNum, pageable);
        return ResponseEntity.ok(watchHistory);
    }


    //마이페이지 본인 리뷰 가져오기
    @GetMapping("/reviews")
    public ResponseEntity<Page<MyPageReviewResponseDTO>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PageableDefault(sort = "createDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Long memNum = userDetails.getMemNum();
        Page<MyPageReviewResponseDTO> reviews = myPageService.getMyReviews(memNum, pageable);
        return ResponseEntity.ok(reviews);
    }
}


//    //작성리뷰리스트보기
//    @GetMapping("/mypage/review")
//    public ResponseEntity<?> myPageReview(
//            @PageableDefault(size = 5, sort = "reviewId", direction = Sort.Direction.DESC) Pageable pageable,
//            @AuthenticationPrincipal CustomUserDetails userDetails
//    ) {
//        try {
//            MemberEntity member = userDetails.memberEntity();
//            Page<MyPageReviewResponseDTO> reviewList = myPageService.getMyPageReviews(member.getMemNum(), pageable, member);
//
//            if (reviewList.isEmpty()) {
//                return ResponseEntity.ok().body(Map.of("message", "작성한 리뷰가 없습니다."));
//            }
//
//            return ResponseEntity.ok().body(reviewList);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "리뷰를 불러오는 중 오류가 발생했습니다."));
//        }
//    }
//
//    //찜한컨텐츠보기
//    @GetMapping("/mypage/favor")
//    public ResponseEntity<?> myPageFavor(
//            @PageableDefault(size = 10, sort = "movie.movieId", direction = Sort.Direction.DESC) Pageable pageable,
//            @AuthenticationPrincipal CustomUserDetails userDetails) {
//        try {
//            MemberEntity member = userDetails.memberEntity();
//            Page<MyPageFavorResponseDTO> favorList = myPageService.getMyFavorList(member.getMemNum(), pageable, member);
//            return ResponseEntity.ok().body(favorList);
//        } catch (Exception e) {
//            log.error("Error fetching favorite movies", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "찜한 컨텐츠를 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
//        }
//    }
//
//    //마이페이지 리뷰 삭제
//    @DeleteMapping("/mypage/review/{reviewId}")
//    public ResponseEntity<?> deleteReview(
//            @PathVariable Long reviewId,
//            @AuthenticationPrincipal CustomUserDetails userDetails) {
//        try {
//            MemberEntity member = userDetails.memberEntity();
//            myPageService.deleteReview(reviewId, member);
//            return ResponseEntity.ok().body(Map.of("message", "리뷰가 성공적으로 삭제되었습니다."));
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("error", e.getMessage()));
//        } catch (Exception e) {
//            log.error("Error deleting review", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "리뷰 삭제 중 오류가 발생했습니다: " + e.getMessage()));
//        }
//    }
//
//    //시청한 영화 목록 보기
//    @GetMapping("/mypage/history")
//    public ResponseEntity<?> getWatchHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
//        try {
//            MemberEntity member = userDetails.memberEntity();
//            List<MyPageWatchHistoryResponseDTO> watchHistoryList = myPageService.getMyPageWatchHistory(member.getMemNum(), member);
//
//            log.info("Watch history size: {}", watchHistoryList.size());
//            return ResponseEntity.ok().body(watchHistoryList);
//        } catch (IllegalArgumentException e) {
//            log.warn("Unauthorized access attempt: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                    .body(Map.of("error", "접근 권한이 없습니다."));
//        } catch (Exception e) {
//            log.error("Error fetching watch history", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "시청 목록을 불러오는 중 오류가 발생했습니다: " + e.getMessage()));
//        }
//    }

