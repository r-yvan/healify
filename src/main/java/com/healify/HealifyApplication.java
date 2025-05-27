package com.healify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories(basePackages = "com.healify.repositories")
@EntityScan(basePackages = "com.healify.entities")
@SpringBootApplication
public class HealifyApplication {
  public static void main(String[] args) {
    SpringApplication.run(HealifyApplication.class, args);
  }
}
