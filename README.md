# 0. Study_nodeJS

생활코딩 node.js 강의 참고. https://opentutorials.org/course/3332

# 1. To setup

## clone repo (branch : mysql)
```
git clone -b mysql https://github.com/ramen4598/Study_nodeJS.git
```

## docker compose up

move to directory where `docker-compose.yml` file is.

and then ...

if you use linux/amd64 flatform check this!

1.1 version is for arm64.

```
services:
  studynode: 
    #image : ghcr.io/ramen4598/studynode:1.1
    ...
```

Select the image according to the platform you use.

```
# you should turn on docker before
docker-compose up
```

## check

Make sure it works fine.
