package com.movie.rock.movie.data.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MovieAdminRequestDTO {

    private Long movieId;
    private String movieTitle;
    private List<String> genres;
    private int runTime;
    private Integer openYear;
    private String movieRating;
    private String movieDescription;
    private List<Long> actorIds;
    private List<Long> directorIds;
    private List<String> posterUrls;
    private List<String> trailerUrls;
    private String filmUrl;

    @Builder
    public MovieAdminRequestDTO(Long movieId, String movieTitle, List<String> genres, int runTime, Integer openYear, String movieRating, String movieDescription,
                                List<Long> actorIds, List<Long> directorIds, List<String> posterUrls, List<String> trailerUrls, String filmUrl) {
        this.movieId = movieId;
        this.movieTitle = movieTitle;
        this.genres = genres;
        this.runTime = runTime;
        this.openYear = openYear;
        this.movieRating = movieRating;
        this.movieDescription = movieDescription;
        this.actorIds = actorIds;
        this.directorIds = directorIds;
        this.posterUrls = posterUrls;
        this.trailerUrls = trailerUrls;
        this.filmUrl = filmUrl;
    }
}