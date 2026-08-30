# Testing — IELTS-BETA

Module: `backend` (Spring Boot, Java 21)

## Testing Framework

**Framework:** JUnit 5 (`org.junit.jupiter`) with **Mockito** (`org.mockito`, via `MockitoExtension`) for mocking, and Spring's `MockMvc` for controller-layer HTTP tests. Pulled in through the `spring-boot-starter-*-test` starters and `spring-security-test` in `backend/pom.xml`.

**Coverage tool:** JaCoCo (`jacoco-maven-plugin` 0.8.12), already configured in `backend/pom.xml` with `prepare-agent` bound to the build and a `report` goal bound to the `test` phase — coverage is generated automatically on every `mvnw test` run, no extra setup needed.

---

## Scope: Unit Testing

Every unit is tested in isolation with its collaborators mocked (`@Mock` + `@ExtendWith(MockitoExtension.class)`) — no real database, no full Spring context, no network calls. `backend/src/test/java/com/ieltsbeta/backend/` mirrors the main source tree 1:1:

| Layer | Test class | Tests | What is verified |
|---|---|---|---|
| Strategy | `pattern/strategy/PracticeTestScoringStrategyTest.java` | 8 | multiple-choice scoring: correct/incorrect/unanswered questions, marks totals |
| Factory | `pattern/factory/ScoringStrategyFactoryTest.java` | 5 | category → strategy resolution; `UnsupportedTestCategoryException` on unknown/null category |
| Facade | `pattern/facade/TestSubmissionFacadeTest.java` | 9 | full submission orchestration: validation, delegation to Strategy/Adapter, persistence calls, observer notification, failure paths |
| Observer | `pattern/observer/ResultGeneratedObserverTest.java` | 2 | observer is invoked with the correct result/attempt data |
| Adapter | `pattern/adapter/ExternalScoreAdapterTest.java` | 11 | percentage→band conversion rule (rounding, clamping, boundaries) |
| Adapter (adaptee) | `pattern/adapter/SimulatedExternalScoreServiceTest.java` | 5 | percentage calculation from marks/total, incl. zero-total edge case |
| Service | `service/AuthServiceTest.java` | 16 | registration, login, duplicate-email and bad-credentials paths |
| Service | `service/AdminUserServiceTest.java` | 13 | admin user CRUD/self-action rules |
| Service | `service/PracticeTestServiceTest.java` | 9 | test/question retrieval and summary building |
| Config | `config/CustomUserDetailsServiceTest.java` | 5 | Spring Security `UserDetailsService` loading by email |
| Config | `config/AdminUserSecurityConfigTest.java` | 5 | admin-only endpoint access rules |
| Exception | `exception/GlobalExceptionHandlerTest.java` | 6 | each custom exception maps to the correct HTTP status/body |
| Controller | `controller/AuthControllerTest.java` | 8 | `/auth/*` endpoints via standalone `MockMvc` |
| Controller | `controller/AdminUserControllerTest.java` | 8 | `/admin/users/*` endpoints via standalone `MockMvc` |
| Controller | `controller/TestControllerTest.java` | 6 | test-listing and submission endpoints via standalone `MockMvc`, `TestSubmissionFacade` mocked |
| Context load | `BackendApplicationTests.java` | 1 | Spring context loads |

**116 test methods across 16 test classes.**

---

## Coverage

**Target:** ≥ 50% line/branch coverage for backend logic (services, utilities, controllers).

**Actual results (JaCoCo report, `target/site/jacoco/index.html`):**

| Package | Instruction Cov. | Branch Cov. | Line Cov. (missed/total) | Classes |
|---|---|---|---|---|
| `com.ieltsbeta.backend.dto` | 63% | n/a | 57.0% (128/298 missed) | 13 |
| `com.ieltsbeta.backend.service` | 82% | 94% | 85.7% (30/210 missed) | 8 |
| `com.ieltsbeta.backend.entity` | 78% | n/a | 80.5% (36/185 missed) | 10 |
| `com.ieltsbeta.backend.controller` | 95% | 83% | 97.3% (2/74 missed) | 4 |
| `com.ieltsbeta.backend.pattern.facade` | 98% | 77% | 98.7% (1/76 missed) | 1 |
| `com.ieltsbeta.backend` (root) | 37% | n/a | 33.3% (2/3 missed) | 1 |
| `com.ieltsbeta.backend.config` | 100% | 100% | 100% | 2 |
| `com.ieltsbeta.backend.pattern.strategy` | 100% | 100% | 100% | 2 |
| `com.ieltsbeta.backend.exception` | 100% | n/a | 100% | 9 |
| `com.ieltsbeta.backend.pattern.adapter` | 100% | 100% | 100% | 3 |
| `com.ieltsbeta.backend.pattern.observer` | 100% | n/a | 100% | 1 |
| `com.ieltsbeta.backend.pattern.factory` | 100% | 100% | 100% | 1 |
| **Total** | **83%** (511/3,060 missed) | **90%** (8/88 missed) | **~79.7%** (199/978 missed) | 55 |

Services, controllers, and all five pattern packages are at 82–100% coverage — well above the 50% target. `dto` (63%) and the application root (37%) are lower, but those are just getters/setters and the `main()` bootstrap, with little logic to test.

**How to generate the coverage report:**
```bash
cd backend
mvn clean test
start .\target\site\jacoco\index.html
```
`clean` clears out any stale `target/` output, `test` runs the suite and — since `prepare-agent` and `report` are already bound in `pom.xml` — generates the JaCoCo report as part of the same run. `start` (Windows) then opens the HTML report in the default browser for the per-class/per-package breakdown.
 
---
 
## Running the Tests
 
```bash
cd backend
./mvnw test          # run the full suite (116 tests) + generate coverage
./mvnw -Dtest=AuthServiceTest test   # run a single test class
```
