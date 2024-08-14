package com.movie.rock.movie.service;

import com.movie.rock.common.CommonService;
import com.movie.rock.common.CommonException.MovieNotFoundException;
import com.movie.rock.common.CommonException.R_RatedCommonException;
import com.movie.rock.member.data.MemberEntity;
import com.movie.rock.member.data.MemberRepository;
import com.movie.rock.movie.data.entity.MovieEntity;
import com.movie.rock.movie.data.repository.MovieRepository;
import com.movie.rock.movie.data.response.MovieDetailResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.movie.rock.common.CommonException.*;

@Service
@RequiredArgsConstructor
public class MovieDetailServiceImpl implements MovieDetailService {

    private final MovieRepository movieRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public MovieDetailResponseDTO getMovieDetail(Long movieId, Long memNum) {
        MovieEntity movie = movieRepository.findByMovieId(movieId)
                .orElseThrow(MovieNotFoundException::new);

        MemberEntity member = memberRepository.findByMemNum(memNum)
                .orElseThrow(MemberNotFoundException::new);

        int age = CommonService.AgeCalculator.calcuateAge(member.getMemBirth());

        if (movie.getMovieRating().equals("청소년 관람 불가") && age < 19) {
            throw new R_RatedCommonException();
        }

        return MovieDetailResponseDTO.fromEntity(movie);
    }
}

// 원래 되던거
//@Service
//@RequiredArgsConstructor
//public class MovieDetailServiceImpl implements MovieDetailService {
//
//    private final MovieRepository movieRepository;
//
//    @Override
//    @Transactional(readOnly = true)
//    public MovieDetailResponseDTO getMovieDetail(Long movieId, Long memNum) {
//        MovieEntity movie = movieRepository.findByMovieId(movieId)
//                .orElseThrow(MovieNotFoundException::new);
//
//        return MovieDetailResponseDTO.fromEntity(movie);
//    }
//}

//package com.movie.rock.movie.service;
//
//import com.movie.rock.common.MovieException;
//import com.movie.rock.movie.data.entity.*;
//        import com.movie.rock.movie.data.repository.*;
//        import com.movie.rock.movie.data.response.MovieResponseDTO;
//import com.movie.rock.movie.data.response.MovieReviewResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.ActorResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.DirectorResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.PosterResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.TrailerResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.FilmResponseDTO;
//import com.movie.rock.movie.data.response.MovieInfoResponseDTO.GenreResponseDTO;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class MovieDetailServiceImpl implements MovieDetailService {
//
//    private final MovieRepository movieRepository;
//    private final MovieActorsRepository movieActorsRepository;
//    private final MovieDirectorsRepository movieDirectorsRepository;
//    private final ActorsPhotosRepository actorsPhotosRepository;
//    private final DirectorsPhotosRepository directorsPhotosRepository;
//    private final MovieGenresRepository movieGenresRepository;
//    private final MoviePostersRepository moviePostersRepository;
//    private final MovieTrailersRepository movieTrailersRepository;
//    private final MovieFilmRepository movieFilmRepository;
//
//
//    @Override
//    @Transactional(readOnly = true)
//    public MovieResponseDTO getMovieDetail(Long movieId, Long MemNum) {
//        Optional<MovieEntity> optionalMovie = movieRepository.findByMovieId(movieId);
//        if (optionalMovie.isEmpty()) {
//            throw new MovieException.MovieNotFoundException();
//        }
//        MovieEntity movie = optionalMovie.get();
//
//        List<MovieActorsEntity> movieActors = movieActorsRepository.findByMovieMovieId(movieId);
//        List<MovieDirectorsEntity> movieDirectors = movieDirectorsRepository.findByMovieMovieId(movieId);
//        List<ActorsPhotosEntity> actorsPhotos = actorsPhotosRepository.findByActorIdIn(movieActors.stream()
//                .map(MovieActorsEntity::getActor)
//                .map(ActorsEntity::getActorId)
//                .collect(Collectors.toList()));
//        List<DirectorsPhotosEntity> directorsPhotos = directorsPhotosRepository.findByDirectorIdIn(movieDirectors.stream()
//                .map(MovieDirectorsEntity::getDirector)
//                .map(DirectorsEntity::getDirectorId)
//                .collect(Collectors.toList()));
//        List<MovieGenresEntity> movieGenres = movieGenresRepository.findByMovieMovieId(movie.getMovieId());
//        Optional<MoviePostersEntity> posters = moviePostersRepository.findFirstByMovieMovieId(movie.getMovieId());
//        List<MovieTrailersEntity> trailers = movieTrailersRepository.findFirstByMovieMovieId(movie.getMovieId());
//        Optional<MovieFilmEntity> film = movieFilmRepository.findByMovieMovieId(movie.getMovieId());
//
//
//        return MovieResponseDTO.builder()
//                .movieId(movie.getMovieId())
//                .movieTitle(movie.getMovieTitle())
//                .genres(movieGenres.stream()
//                        .map(mg -> GenreResponseDTO.fromEntity(mg.getGenre()))
//                        .collect(Collectors.toList()))
//                .runTime(movie.getRunTime())
//                .openYear(movie.getOpenYear())
//                .movieRating(movie.getMovieRating())
//                .movieDescription(movie.getMovieDescription())
//                .actors(movieActors.stream()
//                        .map(ma -> ActorResponseDTO.fromEntity(ma.getActor()))
//                        .collect(Collectors.toList()))
//                .actorsPhotos(actorsPhotos.stream()
//                        .collect(Collectors.toMap(
//                                ap -> Math.toIntExact(ap.getActor().getActorId()),
//                                ActorsPhotosEntity::getActorPhoto)))
//                .directors(movieDirectors.stream()
//                        .map(md -> DirectorResponseDTO.fromEntity(md.getDirector()))
//                        .collect(Collectors.toList()))
//                .directorsPhoto(directorsPhotos.stream()
//                        .collect(Collectors.toMap(
//                                dp -> Math.toIntExact(dp.getDirector().getDirectorId()),
//                                DirectorsPhotosEntity::getDirectorPhoto)))
//                .poster(posters.stream()
//                        .map(PosterResponseDTO::fromEntity)
//                        .collect(Collectors.toList()))
//                .trailer(trailers.stream()
//                        .map(TrailerResponseDTO::fromEntity)
//                        .collect(Collectors.toList()))
//                .movieFilm(film.map(FilmResponseDTO::fromEntity).orElse(null))
//                .reviews(movie.getReviews().stream()
//                        .map(review -> MovieReviewResponseDTO.fromEntity(review, review.getMember()))
//                        .collect(Collectors.toList()))
//                .build();
