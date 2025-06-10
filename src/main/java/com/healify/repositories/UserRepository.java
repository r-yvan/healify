package com.healify.repositories;

import com.healify.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
  
  List<User> findByRole(User.Role role);
  
  List<User> findByRoleAndSpecializationContainingIgnoreCase(User.Role role, String specialization);
  
  List<User> findByRoleAndLocationContainingIgnoreCase(User.Role role, String location);
  
  List<User> findByRoleAndSpecializationContainingIgnoreCaseAndLocationContainingIgnoreCase(User.Role role, String specialization, String location);
}
