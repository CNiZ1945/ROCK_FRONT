package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MovieTrailersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieTrailersRepository extends JpaRepository<MovieTrailersEntity, Long> {

    List<MovieTrailersEntity> findByMovie_MovieId(Long movieId);

    void deleteByMovie_MovieId(Long movieId);


}
