package com.movie.rock.chat.controller;


import com.movie.rock.chat.data.MessageRequestDto;
import com.movie.rock.chat.data.MessageResponseDto;
import com.movie.rock.chat.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/message")
    public ResponseEntity<MessageResponseDto> sendMessage(@RequestBody MessageRequestDto messageRequestDto,
                                                          @RequestHeader("Authorization") String authHeader) {

        //Authorization 헤더에서 토큰을 추출
        String token = authHeader.substring(7);
        System.out.println("Received token: " + token);
        //서비스 호출 및 메시지 처리
        System.out.println("Before saving - MessageText: " + messageRequestDto.getMessageText()
                + ", ChatRoomId: " + messageRequestDto.getChatRoomId());
        MessageResponseDto messageResponseDto = messageService.sendMessage(messageRequestDto, token);
        System.out.println("After saving - MessageId: " + messageResponseDto.getMessageId()
                + ", MessageText: " + messageResponseDto.getMessageText());
        System.out.println("Response DTO - senderId: " + messageResponseDto.getSenderId());
        return ResponseEntity.ok(messageResponseDto);
    }


    // 관리자가 유저 메시지 받기위한 컨트롤러
    @GetMapping("/chatroom/{chatRoomId}/messages")
    public ResponseEntity<List<MessageResponseDto>> getChatRoomMessages(@PathVariable Long chatRoomId) {
        List<MessageResponseDto> messages = messageService.getChatRoomMessages(chatRoomId);
        return ResponseEntity.ok(messages);
    }

    //관리자 응답
    @PostMapping("/admin/reply")
    public ResponseEntity<MessageResponseDto> adminReply(@RequestBody MessageRequestDto messageRequestDto,
                                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        MessageResponseDto response = messageService.adminReply(messageRequestDto, token);
        return ResponseEntity.ok(response);
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/chat/{chatRoomId}")
    public MessageResponseDto sendMessage(@DestinationVariable Long chatRoomId,
                                          MessageRequestDto messageRequestDto,
                                          @Header("Authorization") String token) {
        return messageService.sendMessage(messageRequestDto, token.substring(7));
    }


}
