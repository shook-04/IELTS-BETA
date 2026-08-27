package com.ieltsbeta.backend.repository;

import com.ieltsbeta.backend.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {
}
