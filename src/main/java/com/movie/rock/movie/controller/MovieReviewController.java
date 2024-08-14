package com.movie.rock.movie.controller;

import com.movie.rock.common.CommonException;
import com.movie.rock.common.CommonException.UnauthorizedAccessException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.service.CustomUserDetails;
import com.movie.rock.movie.data.repository.MovieReviewAttractionPointsRepository;
import com.movie.rock.movie.data.repository.MovieReviewEmotionPointsRepository;
import com.movie.rock.movie.data.request.MovieFavorRequestDTO;
import com.movie.rock.movie.data.request.MovieReviewRequestDTO;
import com.movie.rock.movie.data.request.ReviewLikesRequestDTO;
import com.movie.rock.movie.data.response.MovieReviewAttractionPointsRatioResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewEmotionPointsRatioResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewPageResponseDTO;
import com.movie.rock.movie.data.response.MovieReviewResponseDTO.ReviewResponseDTO;
import com.movie.rock.movie.data.response.ReviewLikesResponseDTO;
import com.movie.rock.movie.service.MovieReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user/movies/detail")
@RequiredArgsConstructor
public class MovieReviewController {

    private final MovieReviewService movieReviewService;
    private final MovieReviewAttractionPointsRepository movieReviewAttractionPointsRepository;
    private final MovieReviewEmotionPointsRepository movieReviewEmotionPointsRepository;

    private Long getMemNumFromAuthentication(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserDetails) {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            return customUserDetails.getMemNum();
        } else {
            throw new UnauthorizedAccessException();
        }
    }

    @GetMapping("/{movieId}/reviews")
    public ResponseEntity<ReviewPageResponseDTO> getMovieReviews(
            @PathVariable("movieId") Long movieId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "latest") String sortBy,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewPageResponseDTO reviewPage = movieReviewService.getMovieReviews(movieId, page, member,sortBy);
        return ResponseEntity.ok(reviewPage);
    }

    @PostMapping("/{movieId}/reviews")
    public ResponseEntity<ReviewResponseDTO> createMovieReview(
            @PathVariable("movieId") Long movieId,
            @Valid @RequestBody MovieReviewRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewResponseDTO review = movieReviewService.createMovieReview(movieId, requestDTO, member);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @PutMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> updateMovieReview(
            @PathVariable("movieId") Long movieId,
            @PathVariable("reviewId") Long reviewId,
            @Valid @RequestBody MovieReviewRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        ReviewResponseDTO review = movieReviewService.updateMovieReview(movieId, reviewId, requestDTO, member);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{movieId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteMovieReview(
            @PathVariable("movieId") Long movieId,
            @PathVariable("reviewId") Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        MemberEntity member = userDetails.memberEntity();

        movieReviewService.deleteMovieReview(movieId, reviewId, member);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{movieId}/attraction-point-ratios")
    public ResponseEntity<MovieReviewAttractionPointsRatioResponseDTO> getMovieReviewAttractionPointRatios(@PathVariable Long movieId) {
        MovieReviewAttractionPointsRatioResponseDTO pointRatios = movieReviewAttractionPointsRepository.getAttractionPointRatios(movieId);
        return ResponseEntity.ok(pointRatios);
    }

    @GetMapping("/{movieId}/emotion-point-ratios")
    public ResponseEntity<MovieReviewEmotionPointsRatioResponseDTO> getMovieReviewEmotionPointRatios(@PathVariable Long movieId) {
        MovieReviewEmotionPointsRatioResponseDTO pointRatios = movieReviewEmotionPointsRepository.getEmotionPointRatios(movieId);
        return ResponseEntity.ok(pointRatios);
    }

    @PostMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> addReviewLike(@RequestBody ReviewLikesRequestDTO requestDTO, Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.addLikes(memNum, requestDTO);

        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> removeReviewLike(@PathVariable Long movieId,
                                                                   @PathVariable Long reviewId,
                                                                   Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.removeLikes(memNum, reviewId);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{movieId}/reviews/{reviewId}/likes")
    public ResponseEntity<ReviewLikesResponseDTO> getReviewLikeStatus(@PathVariable Long movieId,
                                                                      @PathVariable Long reviewId,
                                                                      Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        ReviewLikesResponseDTO responseDTO = movieReviewService.getLikesStatus(memNum, reviewId);

        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/{movieId}/reviews/likes")
    public ResponseEntity<List<ReviewLikesResponseDTO>> getReviewLikes( @PathVariable Long movieId,
                                                                        Authentication authentication) {
        Long memNum = getMemNumFromAuthentication(authentication);

        List<ReviewLikesResponseDTO> likesReviews = movieReviewService.getLikesStatusForMovie(movieId, memNum);

        return ResponseEntity.ok(likesReviews);
    }


//    @GetMapping("/{movieId}/reviews/likes")
//    public ResponseEntity<ReviewLikesResponseDTO> getReviewLikes(@PathVariable Long movieId,
//                                                                 @PathVariable Long reviewId,
//                                                                 Authentication authentication) {
//        Long memNum = getMemNumFromAuthentication(authentication);
//
//        List<ReviewLikesResponseDTO> likesReviews = movieReviewService.getLikesReviews(memNum);
//
//        return ResponseEntity.ok((ReviewLikesResponseDTO) likesReviews);
//    }
}

