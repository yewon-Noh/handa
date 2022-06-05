1. DB 구조

![db.png](git/db.png)

2. user 테이블 생성

```bash
CREATE TABLE `user` (
  `u_email` varchar(20) NOT NULL COMMENT '이메일',
  `u_password` varchar(500) NOT NULL COMMENT '비밀번호',
  `u_name` varchar(10) NOT NULL COMMENT '이름',
  `u_tel` varchar(30) NOT NULL COMMENT '연락처',
  `u_job` varchar(20) DEFAULT NULL COMMENT '직업',
  `u_joinDate` date DEFAULT NULL COMMENT '회원가입시간',
  PRIMARY KEY (`u_email`)
)
```

3. category 테이블 생성

```bash
CREATE TABLE `category` (
  `ct_id` varchar(20) NOT NULL COMMENT '자격증 아이디',
  `ct_name` varchar(50) NOT NULL COMMENT '자격증명',
  `ct_etc` varchar(100) DEFAULT NULL COMMENT '자격증 정보',
  PRIMARY KEY (`ct_id`)
)
```

4. hashtag 테이블 생성

```bash
CREATE TABLE `hashtag` (
  `h_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '과목 아이디',
  `h_name` varchar(20) NOT NULL COMMENT '과목명',
  PRIMARY KEY (`h_id`)
)
```

5. question 테이블 생성

```bash
CREATE TABLE `question` (
  `q_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '질문 아이디',
  `ct_id` varchar(20) NOT NULL COMMENT '카테고리 아이디',
  `u_email` varchar(20) NOT NULL COMMENT '질문자 이메일',
  `q_img` varchar(50) NOT NULL COMMENT '질문 이미지',
  `h_id` int(11) NOT NULL COMMENT '해시태그 아이디',
  `update` datetime DEFAULT NULL COMMENT '업로드 날짜',
  PRIMARY KEY (`q_id`),
  KEY `user_question` (`u_email`),
  KEY `hashtag_question` (`h_id`),
  KEY `category_question` (`ct_id`),
  CONSTRAINT `category_question` FOREIGN KEY (`ct_id`) REFERENCES `category` (`ct_id`),
  CONSTRAINT `hashtag_question` FOREIGN KEY (`h_id`) REFERENCES `hashtag` (`h_id`),
  CONSTRAINT `user_question` FOREIGN KEY (`u_email`) REFERENCES `user` (`u_email`)
)
```

6. comment 테이블 생성

```bash
CREATE TABLE `comment` (
  `cm_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '답변 아이디',
  `q_id` int(11) NOT NULL COMMENT '질문 아이디',
  `u_email` varchar(20) NOT NULL COMMENT '답변자 이메일',
  `cm_text` varchar(200) NOT NULL COMMENT '답변 내용',
  `cm_date` datetime DEFAULT NULL COMMENT '댓글 단 시간',
  PRIMARY KEY (`cm_id`),
  KEY `user_comment` (`u_email`),
  KEY `comment_FK` (`q_id`),
  CONSTRAINT `comment_FK` FOREIGN KEY (`q_id`) REFERENCES `question` (`q_id`),
  CONSTRAINT `user_comment` FOREIGN KEY (`u_email`) REFERENCES `user` (`u_email`)
)
```