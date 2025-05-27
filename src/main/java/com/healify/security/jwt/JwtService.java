// JwtService.java
package com.healify.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
  
  private final String SECRET_KEY = "my-super-secret-key-which-needs-to-be-very-long-123456";
  
  private Key getSignInKey() {
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
  }
  
  public String generateToken(String email) {
    return Jwts.builder()
      .setSubject(email)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
      .signWith(getSignInKey(), SignatureAlgorithm.HS256)
      .compact();
  }
  
  public String extractUsername(String token) {
    return Jwts.parserBuilder().setSigningKey(getSignInKey()).build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }
  
  public boolean isTokenValid(String token, String userEmail) {
    return extractUsername(token).equals(userEmail);
  }
}
