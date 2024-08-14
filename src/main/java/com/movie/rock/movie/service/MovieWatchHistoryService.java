package com.movie.rock.movie.service;

import com.movie.rock.movie.data.response.MovieWatchHistoryResponseDTO.WatchHistoryListResponseDTO;

public interface MovieWatchHistoryService {
    WatchHistoryListResponseDTO getContinueWatchingMovies(Long memNum);
    WatchHistoryListResponseDTO getRecentWatchedMovies(Long memNum);
    void updateWatchingProgress(Long memNum, Long movieId, Long watchId, Long watchTIme, Long totalDuration);
}
