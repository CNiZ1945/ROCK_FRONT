//package com.movie.rock.config;
//
//import org.springframework.security.authentication.AbstractAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//
//import java.util.Collection;
//
//
//public class JwtAuthenticationToken extends AbstractAuthenticationToken {
//
//    private final String token;
//    private final String userName;
//
//    public JwtAuthenticationToken(String token){
//        super(null);
//        this.token = token;
//        this.userName = null;
//        setAuthenticated(false);
//    }
//
//    public JwtAuthenticationToken(String userName, String token, Collection<? extends GrantedAuthority> authorities){
//        super(authorities);
//        this.token = token;
//        this.userName = userName;
//        super.setAuthenticated(true);
//    }
//
//    @Override
//    public Object getCredentials() {
//        return token;
//    }
//
//    @Override
//    public Object getPrincipal() {
//        return userName;
//    }
//
//}
