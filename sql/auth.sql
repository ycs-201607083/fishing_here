USE prj241126;

CREATE TABLE auth
(
    auth_id VARCHAR(20) REFERENCES member (member_id),
    auth    VARCHAR(20) NOT NULL,
    PRIMARY KEY (auth_id, auth)
);
SELECT *
FROM auth;

INSERT INTO auth
    VALUE ('1', 'kms');

INSERT INTO auth
    VALUE ('1', 'ybk');

INSERT INTO auth
    VALUE ('1', 'kjb');