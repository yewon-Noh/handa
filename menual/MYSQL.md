1. mysql 설치

```bash
sudo apt install mysql
```

2. 초기설정

```bash
ubuntu@ip-:~$ sudo ufw allow mysql
Rules updated
Rules updated (v6)

ubuntu@ip-:~$ sudo systemctl start mysql

ubuntu@ip-:~$ sudo systemctl enable mysql
Synchronizing state of mysql.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable mysql
```

3. mysql 접속

```bash
ubuntu@ip-:~$ sudo /usr/bin/mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.36-0ubuntu0.18.04.1 (Ubuntu)

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

4. mysql 버전 확인

```bash
mysql> show variables like "%version%";
+-------------------------+-------------------------+
| Variable_name           | Value                   |
+-------------------------+-------------------------+
| innodb_version          | 5.7.36                  |
| protocol_version        | 10                      |
| slave_type_conversions  |                         |
| tls_version             | TLSv1,TLSv1.1,TLSv1.2   |
| version                 | 5.7.36-0ubuntu0.18.04.1 |
| version_comment         | (Ubuntu)                |
| version_compile_machine | x86_64                  |
| version_compile_os      | Linux                   |
+-------------------------+-------------------------+
8 rows in set (0.00 sec)
```

5. root 비밀번호 설정

```bash
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('password');
Query OK, 0 rows affected, 2 warnings (0.00 sec)
```

6. 외부 접속을 위해 변경

```bash
ubuntu@ip-172-31-4-206:~$ sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

bind-address            = 0.0.0.0
```

7. mysql 재시작

```bash
ubuntu@ip-172-31-4-206:~$ sudo service mysql restart
```

8. 유저 추가

```bash
ubuntu@ip-172-31-4-206:~$ sudo /usr/bin/mysql -u root -p

mysql> create user 'handa'@'%' identified by 'password';
Query OK, 0 rows affected (0.00 sec)
```

9. DB 생성

```bash
mysql> create database handa default character set utf8;
Query OK, 1 row affected (0.01 sec)
```

10. 유저 권한 부여

```bash
mysql> grant all on handa.* to 'handa'@'%' identified by 'password' with grant option;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> grant all privileges on *.* to 'handa'@'%' with grant option;
Query OK, 0 rows affected (0.00 sec)
```
