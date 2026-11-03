CREATE DATABASE devpedia CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE devpedia_test CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE devpedia;
CREATE TABLE members (
  member_id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) COLLATE utf8mb4_0900_as_cs NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(30) COLLATE utf8mb4_0900_as_cs NOT NULL,
  bio VARCHAR(500) NULL,
  github_url VARCHAR(2048) NULL,
  portfolio_url VARCHAR(2048) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  PRIMARY KEY (member_id),
  CONSTRAINT uq_member_email UNIQUE (email),
  CONSTRAINT uq_member_nickname UNIQUE (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE roles (
  role_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (role_id),
  CONSTRAINT uq_roles_name UNIQUE (name),
  CONSTRAINT ck_roles_order CHECK (display_order >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE tech_stacks (
  tech_stack_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (tech_stack_id),
  CONSTRAINT uq_tech_stacks_name UNIQUE (name),
  CONSTRAINT ck_tech_stacks_order CHECK (display_order >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE member_interest_roles (
  member_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  PRIMARY KEY (member_id, role_id),
  CONSTRAINT fk_member_interest_roles_member FOREIGN KEY (member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_member_interest_roles_ref FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE member_tech_stacks (
  member_id BIGINT NOT NULL,
  tech_stack_id BIGINT NOT NULL,
  PRIMARY KEY (member_id, tech_stack_id),
  CONSTRAINT fk_member_tech_stacks_member FOREIGN KEY (member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_member_tech_stacks_ref FOREIGN KEY (tech_stack_id) REFERENCES tech_stacks (tech_stack_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recruitment_posts (
  post_id BIGINT NOT NULL AUTO_INCREMENT,
  author_member_id BIGINT NOT NULL,
  type VARCHAR(16) NOT NULL,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  start_date DATE NOT NULL,
  application_deadline_date DATE NULL,
  work_mode VARCHAR(16) NOT NULL,
  region_text VARCHAR(100) NULL,
  expected_duration_text VARCHAR(50) NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'OPEN',
  close_reason VARCHAR(24) NULL,
  closed_at DATETIME(6) NULL,
  removed_at DATETIME(6) NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  PRIMARY KEY (post_id),
  CONSTRAINT fk_post_author FOREIGN KEY (author_member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_post_type CHECK (type IN ('PROJECT','STUDY')),
  CONSTRAINT ck_post_mode CHECK (work_mode IN ('ONLINE','OFFLINE','HYBRID')),
  CONSTRAINT ck_post_status CHECK (status IN ('OPEN','CLOSED','REMOVED')),
  CONSTRAINT ck_post_dates CHECK (application_deadline_date IS NULL OR application_deadline_date < start_date),
  CONSTRAINT ck_post_close CHECK ((status='OPEN' AND close_reason IS NULL AND closed_at IS NULL AND removed_at IS NULL) OR (status='CLOSED' AND close_reason IS NOT NULL AND closed_at IS NOT NULL AND removed_at IS NULL) OR (status='REMOVED' AND removed_at IS NOT NULL AND ((close_reason IS NULL AND closed_at IS NULL) OR (close_reason IS NOT NULL AND closed_at IS NOT NULL)))),
  CONSTRAINT ck_post_reason CHECK (close_reason IS NULL OR close_reason IN ('OWNER','ALL_ROLES_FILLED')),
  KEY ix_post_created (created_at DESC, post_id DESC),
  KEY ix_post_author (author_member_id, created_at DESC, post_id DESC),
  KEY ix_post_status_start (status, start_date, post_id),
  KEY ix_post_status_deadline (status, application_deadline_date, post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recruitment_slots (
  slot_id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  capacity INT NOT NULL,
  created_at DATETIME(6) NOT NULL,
  updated_at DATETIME(6) NOT NULL,
  PRIMARY KEY (slot_id),
  CONSTRAINT uq_slot_post_role UNIQUE (post_id, role_id),
  CONSTRAINT uq_slot_id_post UNIQUE (slot_id, post_id),
  CONSTRAINT fk_slot_post FOREIGN KEY (post_id) REFERENCES recruitment_posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_slot_role FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_slot_capacity CHECK (capacity BETWEEN 1 AND 20)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE recruitment_post_tech_stacks (
  post_id BIGINT NOT NULL,
  tech_stack_id BIGINT NOT NULL,
  PRIMARY KEY (post_id, tech_stack_id),
  CONSTRAINT fk_posttech_post FOREIGN KEY (post_id) REFERENCES recruitment_posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_posttech_tech FOREIGN KEY (tech_stack_id) REFERENCES tech_stacks (tech_stack_id) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE applications (
  application_id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  slot_id BIGINT NOT NULL,
  applicant_member_id BIGINT NOT NULL,
  motivation TEXT NOT NULL,
  github_url_snapshot VARCHAR(2048) NULL,
  portfolio_url_snapshot VARCHAR(2048) NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'UNDER_REVIEW',
  auto_close_reason VARCHAR(16) NULL,
  submitted_at DATETIME(6) NOT NULL,
  decided_at DATETIME(6) NULL,
  decided_by_member_id BIGINT NULL,
  PRIMARY KEY (application_id),
  CONSTRAINT fk_app_post FOREIGN KEY (post_id) REFERENCES recruitment_posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_app_slot_post FOREIGN KEY (slot_id, post_id) REFERENCES recruitment_slots (slot_id, post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_app_member FOREIGN KEY (applicant_member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_app_decider FOREIGN KEY (decided_by_member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_app_state CHECK ((status='UNDER_REVIEW' AND decided_at IS NULL AND decided_by_member_id IS NULL AND auto_close_reason IS NULL) OR (status IN ('APPROVED','REJECTED','WITHDRAWN') AND decided_at IS NOT NULL AND decided_by_member_id IS NOT NULL AND auto_close_reason IS NULL) OR (status='AUTO_CLOSED' AND decided_at IS NOT NULL AND decided_by_member_id IS NULL AND auto_close_reason IS NOT NULL AND auto_close_reason IN ('ROLE_FILLED','POST_CLOSED','POST_REMOVED'))),
  KEY ix_app_slot_status (slot_id, status, application_id),
  KEY ix_app_post_status (post_id, status, submitted_at DESC, application_id DESC),
  KEY ix_app_member_time (applicant_member_id, submitted_at DESC, application_id DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE comments (
  comment_id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  author_member_id BIGINT NOT NULL,
  parent_comment_id BIGINT NULL,
  content VARCHAR(1000) NULL,
  is_content_removed TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL,
  edited_at DATETIME(6) NULL,
  PRIMARY KEY (comment_id),
  CONSTRAINT uq_comment_id_post UNIQUE (comment_id, post_id),
  CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES recruitment_posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_comment_author FOREIGN KEY (author_member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_comment_parent_post FOREIGN KEY (parent_comment_id, post_id) REFERENCES comments (comment_id, post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT ck_comment_content CHECK ((is_content_removed=0 AND content IS NOT NULL AND CHAR_LENGTH(TRIM(content)) BETWEEN 1 AND 1000) OR (is_content_removed=1 AND content IS NULL AND parent_comment_id IS NULL)),
  KEY ix_comment_page (post_id, created_at, comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE bookmarks (
  member_id BIGINT NOT NULL,
  post_id BIGINT NOT NULL,
  created_at DATETIME(6) NOT NULL,
  PRIMARY KEY (member_id, post_id),
  CONSTRAINT fk_bookmark_member FOREIGN KEY (member_id) REFERENCES members (member_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT fk_bookmark_post FOREIGN KEY (post_id) REFERENCES recruitment_posts (post_id) ON DELETE RESTRICT ON UPDATE RESTRICT,
  KEY ix_bookmark_page (member_id, created_at DESC, post_id DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

