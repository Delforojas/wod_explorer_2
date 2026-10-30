DELIMITER $$

DROP PROCEDURE IF EXISTS apply_google_oauth_migration$$

CREATE PROCEDURE apply_google_oauth_migration()
BEGIN
  DECLARE column_type_value VARCHAR(255);
  DECLARE nullable_value VARCHAR(3);
  DECLARE engine_value VARCHAR(64);
  DECLARE object_count INT DEFAULT 0;
  DECLARE correct_foreign_key_count INT DEFAULT 0;

  IF DATABASE() IS NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Google OAuth migration requires a selected database';
  END IF;

  SELECT COUNT(*) INTO object_count
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND table_type = 'BASE TABLE';

  IF object_count = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Google OAuth migration requires the users table';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'id';

  IF LOWER(column_type_value) <> 'bigint unsigned' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible users.id column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'password_hash';

  IF LOWER(column_type_value) <> 'varchar(255)' OR nullable_value = 'MISSING' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible users.password_hash column';
  END IF;

  IF nullable_value = 'NO' THEN
    ALTER TABLE users
      MODIFY COLUMN password_hash varchar(255) NULL;
  ELSEIF nullable_value <> 'YES' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible users.password_hash nullability';
  END IF;

  CREATE TABLE IF NOT EXISTS oauth_login_handoffs (
    id bigint unsigned NOT NULL AUTO_INCREMENT,
    token_hash varchar(64) NOT NULL,
    browser_binding_hash varchar(64) DEFAULT NULL,
    user_id bigint unsigned NOT NULL,
    provider varchar(50) NOT NULL,
    redirect_path varchar(255) NOT NULL,
    expires_at datetime(6) NOT NULL,
    consumed_at datetime(6) DEFAULT NULL,
    created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_oauth_login_handoffs_token_hash (token_hash),
    KEY idx_oauth_handoffs_expires_at (expires_at),
    CONSTRAINT fk_oauth_handoffs_user
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

  SELECT COALESCE(MAX(engine), '') INTO engine_value
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs';

  IF engine_value <> 'InnoDB' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs storage engine';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'id';

  IF LOWER(column_type_value) <> 'bigint unsigned' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.id column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'token_hash';

  IF LOWER(column_type_value) <> 'varchar(64)' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.token_hash column';
  END IF;

  SELECT COUNT(*) INTO object_count
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'browser_binding_hash';

  IF object_count > 0 THEN
    SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
      INTO column_type_value, nullable_value
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'oauth_login_handoffs'
      AND column_name = 'browser_binding_hash';

    IF LOWER(column_type_value) <> 'varchar(64)' OR nullable_value <> 'YES' THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.browser_binding_hash column';
    END IF;
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'user_id';

  IF LOWER(column_type_value) <> 'bigint unsigned' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.user_id column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'provider';

  IF LOWER(column_type_value) <> 'varchar(50)' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.provider column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'redirect_path';

  IF LOWER(column_type_value) <> 'varchar(255)' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.redirect_path column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'expires_at';

  IF LOWER(column_type_value) <> 'datetime(6)' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.expires_at column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'consumed_at';

  IF LOWER(column_type_value) <> 'datetime(6)' OR nullable_value <> 'YES' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.consumed_at column';
  END IF;

  SELECT COALESCE(MAX(column_type), ''), COALESCE(MAX(is_nullable), 'MISSING')
    INTO column_type_value, nullable_value
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'created_at';

  IF LOWER(column_type_value) <> 'datetime(6)' OR nullable_value <> 'NO' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.created_at column';
  END IF;

  IF object_count = 0 THEN
    ALTER TABLE oauth_login_handoffs
      ADD COLUMN browser_binding_hash varchar(64) DEFAULT NULL AFTER token_hash;
  END IF;

  SELECT COUNT(*) INTO object_count
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'token_hash'
    AND non_unique = 0;

  IF object_count = 0 THEN
    ALTER TABLE oauth_login_handoffs
      ADD UNIQUE KEY uq_oauth_login_handoffs_token_hash (token_hash);
  END IF;

  SELECT COUNT(*) INTO object_count
  FROM information_schema.key_column_usage
  WHERE constraint_schema = DATABASE()
    AND table_name = 'oauth_login_handoffs'
    AND column_name = 'user_id'
    AND referenced_table_name IS NOT NULL;

  IF object_count = 0 THEN
    ALTER TABLE oauth_login_handoffs
      ADD CONSTRAINT fk_oauth_handoffs_user
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
  ELSE
    SELECT COUNT(*) INTO correct_foreign_key_count
    FROM information_schema.key_column_usage
    WHERE constraint_schema = DATABASE()
      AND table_name = 'oauth_login_handoffs'
      AND column_name = 'user_id'
      AND referenced_table_name = 'users'
      AND referenced_column_name = 'id';

    IF correct_foreign_key_count = 0 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Incompatible oauth_login_handoffs.user_id foreign key';
    END IF;
  END IF;
END$$

CALL apply_google_oauth_migration()$$
DROP PROCEDURE apply_google_oauth_migration$$

DELIMITER ;
