-- DEMO:

-- DROP TABLE IF EXISTS people;

-- CREATE TABLE people (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(255),
--     last_name VARCHAR(255)
-- );

-- INSERT INTO people (first_name, last_name) VALUES ('Diane', 'Stephani');
-- SELECT * FROM people;

CREATE TABLE location (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude Decimal(8,6),
  longitude Decimal(9,6)
)

