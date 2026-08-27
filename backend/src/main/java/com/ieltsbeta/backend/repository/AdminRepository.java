package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByUserUserId(Long userId);
}