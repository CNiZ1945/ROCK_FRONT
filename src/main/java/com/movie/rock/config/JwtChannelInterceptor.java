//package com.movie.rock.config;
//
//
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.messaging.support.MessageHeaderAccessor;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//
//import java.util.Collections;
//
//public class JwtChannelInterceptor implements ChannelInterceptor{
//
//    private final JwtUtil jwtUtil;
//
//    public JwtChannelInterceptor(JwtUtil jwtUtil) {
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message,StompHeaderAccessor.class);
//
//        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
//            String jwtToken = accessor.getFirstNativeHeader("Authorization");
//            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
//                jwtToken = jwtToken.substring(7);
//                String memberId = jwtUtil.extractMemberId(jwtToken);
//                if (jwtUtil.isTokenValid(jwtToken, memberId)) {
//                    accessor.setUser(new UsernamePasswordAuthenticationToken(
//                            memberId,
//                            null,
//                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
//                    ));
//                    return message;
//                }
//            }
//            return null; // Invalid token or no token, reject the connection
//        }
//
//        return message;
//    }
//
//}
