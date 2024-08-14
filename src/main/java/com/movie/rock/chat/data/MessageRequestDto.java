package com.movie.rock.chat.data;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MessageRequestDto {

    @JsonProperty("messageText")
    private String messageText;

    @JsonProperty("chatRoomId")
    private Long chatRoomId;


    @Builder
    public MessageRequestDto(Long chatRoomId,String messageText){
        this.chatRoomId =chatRoomId;
        this.messageText =messageText;
    }
}
