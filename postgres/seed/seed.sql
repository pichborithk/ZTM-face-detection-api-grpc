BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Bo', 'bo@gmail.com', 4, '2022-11-26');

-- password = password
INSERT into login (hash, email) values ('$2a$10$adsfvwhw5L5kiPn83ytgQ.zFK1mRXtdSLr.MuqPzA4D7OmcKTk7MG', 'bo@gmail.com');

COMMIT;