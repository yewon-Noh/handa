1. root 계정 생성

```bash
su passwd root
```

비밀번호 1234로 설정함

2. root 계정으로 접속

```bash
su root
```

3. ssh 키 생성

```bash
ssh-keygen -t ed25519 -C "yewo2nn16@gmail.com"
```

4. ssh 공개키를 github에 등록

```bash
vim /root/.ssh/id_ed25519.pub

ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILdYRMp2rQKAGR07872ph+iujCJRoyjzdoSZLfjlW2AG yewo2nn16@gmail.com
```

![01.JPG](git/01.JPG)

5. ssh 키가 정상적으로 등록됬는지 확인

```bash
root@ip-172-31-4-206:~# ssh -T git@github.com
Hi yewon-Noh! You've successfully authenticated, but GitHub does not provide shell access.
```

6. 사용할 폴더 생성

```bash
root@ip-172-31-4-206:~# mkdir mtvs
root@ip-172-31-4-206:~# cd mtvs/
```

7. 깃 복제(clone)

```bash
root@ip-172-31-4-206:~/mtvs# git clone git@github.com:yewon-Noh/MTVS.git
```

8. 깃 pull

```bash
root@ip-172-31-4-206:~/mtvs/MTVS# git pull origin ver1.0
```

9. node 시작

```bash
nohup node server.js &
exit
```

10. 포트 죽이기
```bash
sudo fuser -k -n tcp 3000
```
