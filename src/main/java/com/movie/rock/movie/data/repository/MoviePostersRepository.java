package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.MoviePostersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoviePostersRepository extends JpaRepository<MoviePostersEntity, Long> {

    List<MoviePostersEntity> findByMovie_MovieId(Long movieId);

    void deleteByMovie_MovieId(Long movieId);

}