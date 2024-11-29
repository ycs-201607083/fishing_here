USE prj241126;

CREATE TABLE auth
(
    auth_id VARCHAR(20) REFERENCES member (member_id),
    auth    VARCHAR(20) NOT NULL,
    PRIMARY KEY (auth_id, auth)
);
SELECT *
FROM auth;

DROP TABLE auth;

DESC member;

INSERT INTO auth
    VALUE ('kms', 'auth');

INSERT INTO auth
    VALUE ('ybk', 'auth');

INSERT INTO auth
    VALUE ('kjb', 'auth');

SELECT *
FROM member
WHERE member_id = '1';

DESC member;

SELECT *
FROM member;

SELECT member_id id, member_password password
FROM member
WHERE member_id = '1';

select *
from member;