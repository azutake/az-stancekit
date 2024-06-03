-- migrate:up
ALTER TABLE player_vehicles
ADD has_stance TINYINT NOT NULL DEFAULT 0;

ALTER TABLE player_vehicles
ADD stance_mods json NOT NULL DEFAULT "{}";

-- migrate:down
ALTER TABLE player_vehicles
DROP COLUMN stance_mods;

ALTER TABLE player_vehicles
DROP COLUMN has_stance;
