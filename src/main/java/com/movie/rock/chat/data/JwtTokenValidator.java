//package com.movie.rock.chat.data;
//
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jws;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//import java.util.List;
//
//// 유틸
//@Component
//public class JwtTokenValidator {
//
//    private final Key key;
//
//    public JwtTokenValidator(@Value("${jwt.secret}")String secret){
//        this.key = Keys.hmacShaKeyFor(secret.getBytes());
//    }
//
//    public boolean isValidToken(String token){
//        try{
//            //1.토큰 파싱
//            Jws<Claims> claims = Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token);
//
//            //2.만료 시간 확인
//            Date now = new Date();
//            if(claims.getBody().getExpiration().before(now)){
//                return false;
//            }
//
//            //3. 추가적인 클레임 검증(발행자 확인)
//            String issuer = claims.getBody().getIssuer();
//            if(!"movie-rock".equals(issuer)){
//                return false;
//            }
//
//            //4. 사용자 권환 확인(옵션)
//            List<String> roles = (List<String>) claims.getBody().get("roles");
//            if(roles == null || roles.isEmpty()){
//                return false;
//            }
//
//
//            //모든 검증을 통과하면 유효한 토큰
//            return true;
//        }catch (Exception e){
//            //파싱 실패, 서명 불일치 등의 경우
//            return false;
//        }
//    }
//
//    public String getUserNameFromToken(String token){
//        try{
//            Claims claims = Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//            // JWT의 'sub' (subject) 클레임에서 사용자 이름을 가져옵니다.
//            // JWT를 생성할 때 사용자 이름을 'sub' 클레임에 넣었다고 가정합니다.
//            return claims.getSubject();
//        } catch (Exception e) {
//            // 토큰 파싱에 실패하면 null을 반환하거나 예외를 던질 수 있습니다.
//            return null;
//        }
//    }
//
//}
