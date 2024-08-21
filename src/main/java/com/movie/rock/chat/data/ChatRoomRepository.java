package com.movie.rock.chat.data;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoomEntity,Long> {
    Optional<ChatRoomEntity> findByMemberMemNumAndStatus(Long memNum, String status);


    List<ChatRoomEntity> findByStatus(String status);

    List<ChatRoomEntity> findByMemberMemNum(Long memNum);  // 특정 회원의 모든 채팅방 조회
}
