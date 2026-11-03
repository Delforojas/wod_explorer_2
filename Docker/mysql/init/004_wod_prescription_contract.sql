SET @has_calories := (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'wod_version_items'
    AND column_name = 'calories'
);
SET @sql := IF(@has_calories = 0,
  'ALTER TABLE wod_version_items ADD COLUMN calories INT UNSIGNED NULL AFTER duration_seconds',
  'SELECT 1');
PREPARE statement FROM @sql;
EXECUTE statement;
DEALLOCATE PREPARE statement;

SET @has_legacy_check := (
  SELECT COUNT(*)
  FROM information_schema.table_constraints
  WHERE constraint_schema = DATABASE()
    AND table_name = 'wod_version_items'
    AND constraint_name = 'wod_version_items_chk_1'
);
SET @sql := IF(@has_legacy_check > 0,
  'ALTER TABLE wod_version_items DROP CHECK wod_version_items_chk_1',
  'SELECT 1');
PREPARE statement FROM @sql;
EXECUTE statement;
DEALLOCATE PREPARE statement;

SET @has_prescription_check := (
  SELECT COUNT(*)
  FROM information_schema.table_constraints
  WHERE constraint_schema = DATABASE()
    AND table_name = 'wod_version_items'
    AND constraint_name = 'chk_wod_item_prescription'
);
SET @sql := IF(@has_prescription_check = 0,
  'ALTER TABLE wod_version_items ADD CONSTRAINT chk_wod_item_prescription CHECK (reps IS NOT NULL OR weight_kg IS NOT NULL OR distance_m IS NOT NULL OR duration_seconds IS NOT NULL OR calories IS NOT NULL)',
  'SELECT 1');
PREPARE statement FROM @sql;
EXECUTE statement;
DEALLOCATE PREPARE statement;

CREATE TABLE IF NOT EXISTS wod_item_prescriptions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  wod_version_item_id BIGINT UNSIGNED NOT NULL,
  variant VARCHAR(20) NOT NULL,
  weight_kg DECIMAL(8, 3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wod_item_variant (wod_version_item_id, variant),
  CONSTRAINT fk_wod_item_prescriptions_item
    FOREIGN KEY (wod_version_item_id) REFERENCES wod_version_items (id),
  CONSTRAINT chk_wod_item_variant CHECK (variant IN ('MEN', 'WOMEN')),
  CONSTRAINT chk_wod_item_weight CHECK (weight_kg > 0)
);

CREATE TABLE IF NOT EXISTS wod_progression_rules (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  wod_version_id BIGINT UNSIGNED NOT NULL,
  start_reps INT UNSIGNED NOT NULL,
  increment_reps INT UNSIGNED NOT NULL,
  every_rounds INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wod_progression_version (wod_version_id),
  CONSTRAINT fk_wod_progression_version
    FOREIGN KEY (wod_version_id) REFERENCES wod_versions (id),
  CONSTRAINT chk_wod_progression_positive
    CHECK (start_reps > 0 AND increment_reps > 0 AND every_rounds > 0)
);

CREATE TABLE IF NOT EXISTS wod_time_extensions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  wod_version_id BIGINT UNSIGNED NOT NULL,
  initial_seconds INT UNSIGNED NOT NULL,
  extension_seconds INT UNSIGNED NOT NULL,
  rounds_per_extension INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wod_time_extension_version (wod_version_id),
  CONSTRAINT fk_wod_time_extension_version
    FOREIGN KEY (wod_version_id) REFERENCES wod_versions (id),
  CONSTRAINT chk_wod_time_extension_positive
    CHECK (initial_seconds > 0 AND extension_seconds > 0 AND rounds_per_extension > 0)
);
