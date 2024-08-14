package com.movie.rock.chat.controller;


import com.movie.rock.chat.data.ChatRoomResponseDTO;
import com.movie.rock.chat.data.MessageRequestDto;
import com.movie.rock.chat.data.MessageResponseDto;
import com.movie.rock.chat.service.ChatRoomService;
import com.movie.rock.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/chatrooms")
@RequiredArgsConstructor
public class AdminChatRoomController {

    private final ChatRoomService chatRoomService;
    private final MessageService messageService;

    @GetMapping("/active")
    public ResponseEntity<List<ChatRoomResponseDTO>> getActiveChatRooms() {
        List<ChatRoomResponseDTO> activeChatRooms = chatRoomService.getAllActiveChatRooms();
        return ResponseEntity.ok(activeChatRooms);
    }

    @GetMapping("/{chatRoomId}")
    public ResponseEntity<ChatRoomResponseDTO> getChatRoom(@PathVariable Long chatRoomId) {
        ChatRoomResponseDTO chatRoom = chatRoomService.getChatRoomById(chatRoomId);
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/{chatRoomId}/messages")
    public ResponseEntity<List<MessageResponseDto>> getChatRoomMessages(@PathVariable Long chatRoomId) {
        List<MessageResponseDto> messages = messageService.getChatRoomMessages(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{chatRoomId}/reply")
    public ResponseEntity<MessageResponseDto> adminReply(
            @PathVariable Long chatRoomId,
            @RequestBody MessageRequestDto messageRequestDto,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        messageRequestDto.setChatRoomId(chatRoomId);
        MessageResponseDto response = messageService.adminReply(messageRequestDto, token);
        return ResponseEntity.ok(response);
    }
}
