use prj241126;

INSERT INTO product
    (product_seller_number, product_name, product_price, product_tag_id)
VALUES (2, '컴퓨터', 3500, 1);

select *
from product;

DESC product;

select *
from member;

alter table member
    add member_inserted DATETIME DEFAULT NOW();