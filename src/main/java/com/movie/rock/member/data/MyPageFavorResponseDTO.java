package com.movie.rock.member.data;

import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.entity.PostersEntity;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO;
import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MyPageFavorResponseDTO {
    private Long movieId;
    private String movieTitle;
    private PosterResponseDTO poster;
    private Long memNum;
    private boolean isFavorite;

    @Builder
    public MyPageFavorResponseDTO(Long movieId,String movieTitle, Long posterId, String posterUrl, Boolean mainPoster,Long memNum,
                                  boolean isFavorite){
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.poster = new PosterResponseDTO(posterId, posterUrl, mainPoster);
        this.memNum = memNum;
        this.isFavorite = isFavorite;
    }
}
//    public static MyPageFavorResponseDTO fromEntity(MovieEntity movieEntity, PostersEntity postersEntity, MemberEntity memberEntity){
//        return MyPageFavorResponseDTO.builder()
//                .movieId(movieEntity.getMovieId())
//                .movieTitle(movieEntity.getMovieTitle())
//                .posterUrls(postersEntity.getPosterUrls())
//                .memNum(memberEntity.getMemNum())
//                .build();
//    }

