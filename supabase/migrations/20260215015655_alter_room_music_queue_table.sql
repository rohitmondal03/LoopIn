-- change column name for room_music_queue's created_at to added_at

ALTER TABLE room_music_queue RENAME COLUMN created_at TO added_at;
