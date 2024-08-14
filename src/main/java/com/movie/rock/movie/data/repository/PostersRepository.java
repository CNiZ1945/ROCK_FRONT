package com.movie.rock.movie.data.repository;

import com.movie.rock.movie.data.entity.PostersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostersRepository extends JpaRepository<PostersEntity, Long> {
}
