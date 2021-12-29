CREATE TABLE `history` (
  `php_session_id` VARCHAR(255) NOT NULL,
  `query` VARCHAR(255) NOT NULL,
  `is_success` INT(11) NOT NULL,
  `date` INT(32) NOT NULL
);