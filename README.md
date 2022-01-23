## docker 와 react app


Dockerfile을 한 개만 만들수도, 여러 개 만들 수도 있다.
개발 단계를 위한 것과 배포 후를 위한 것을 따로 작성하는 게 실무적으로 좋다.

개발 단계를 위해서 Dockerfile.dev 를 만듬

root 에서 docker build ./

하게 되면 에러가 뜬다. dockerfile을 읽을 수 없다는 에러 인데 이런 문제는 dockerfile.dev
라는 명칭을 사용해서 이다. 

이 에러를 해결하기 위해서는 빌드를 할 떄 별도로 이름을 지정해주어야 한다

`docker build -f Dockerfile.dev .`

-f 옵션은 이미지를 빌드 할 때 쓰일 도커 파일을 임의로 지정해준다는 뜻이다. 

도커아닌 환경이 아닌 환경에서는 node_modules가 반드시 필요한 부분이겠지만 
도커 환경에서는 필요하지 않다. 

로컬에 노드 모듈이 있으면 빌드시간만 더 늘어난다. 왜냐면 node_modules까지 카피를 하게 되기 때문..

node_modules 를 우선 삭제하고 

- image build    
` docker build -f Dockerfile.dev -t kklily592/docker-react-app ./`


- image run    
`docker run -it -p 3000:3000 <image name>`


## volume 을 이용

volume을 이용해 소스를 변경했을 때 다시 이미지를 빌드하지 않아도 변경한 소스 부분이 어플리케이션에 반영될 수 있도록 해보기

### COPY와 Volume의 차이점 

카피는, 로컬에 있는 소스코드를 도커 컨테이너에 복사를 해주는 개념

Volume을 이용한다는 것은 도커 컨테이너에서 로컬에 있는 소스코드를 매핑을 해서 참조를 하는 개념

### 실행하는 법

`docker run -p 3000:3000 -v /usr/src/app/node_modules -v $(pwd):/usr/src/app <image id>`

- `-v /usr/src/app/node_modules`
: 호스트 디렉토리에 node_modules(현재 삭제 된 것 )은 없기에 컨테이너에 매핑하지 말라고 하는 것

- `$(pwd):/usr/src/app`
: pwd 경로에 있는 디렉토리 혹은 파일을 /usr/src/app 경로에서 참조 한다. 


## docker-compose 파일 작성하기

서버를 실행하려면 지금까지 너무 많은 스크립트를 써서 실행해야했음

docker-compose.yml에 서비스를 매핑시키고, 컨테이너 이름을 작성해주고
해당 도커 파일을 써주고 포트 매핑을 해준다. 

해당 스크립트를 작성했다면, docker-compose up만 명령어를 입력해주면 해당 개발을 바로 진행할 수 있다. 

## 도커 컨테이너 안에서 리액트 테스트 진행하기

이미지 생성

`docker build -f dockerfile.dev .`

run app 

`docker run -it <image name> npm run test`

## nginx

운영환경에서는 데브 서버가 필요하지 않다. 정적파일만을 제공해주기 위해 nginx를 사용해보자 (웹서버)

개발서버를 왜 운영환경에서 사용하면 안되는 걸까?

-> 개발에서 사용하는 서버는 소스를 ㄹ변경하면 자동으로 전체 앱을 다시 빌드해서 변경소스를 반영해주는 것과 같이 개발 환경에 특화된 기능들이 있기에 
그러한 기능이 없는 nginx 서버보다 더욱 적합하지만

운영 환경에서는 소스르 변경할 떄 다시 반영해줄 필요가 없으며 개발에 필요한 긴으들이 필요하지 않기에 더 깔끔하고 빠른 Nginx를 웺서버로 사용한다.

## 운영환경의 도커 파일을 작성하기

먼저 리액트 스크립트를 이용해서 빌드파일을 만들고, nginx를 이용해서 해당 정적 파일을 제공하는 개념이다. 

운영환경을 위한 Dockerfile을 요약하자면 2가지 단계로 이루어져 있다.

첫 번째 단계는 빌드 파일을 생성하는 **Builder stage**

두 번째 단계는 Nginx를 가동하고 첫 번째 단계에서 생성된 빋르 폴더의 파일들을 웹브라우저의 요청에 따라 베공하는 **Run stage**

nginx가 사용하는 단계의 스크립트를 보게되면,

```yaml
FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
```

`--from=builder` : 다른 stage에 있는 파일을 복사할 때 다른 Stage 이름을 명시 

`/usr/src/app/build` : builder stage 에서 생성된 파일들은 /usr/src/build 에 들어가게 되며 그곳에 저장된 파일들을 /usr/share/nginx/html로 복사를 시켜줘서 
nginx 가 웹 브라우저의 http 요청이 올 때 마다 알맞은 파일을 전해줄 수 있게 만든다. 


`/usr/share/nginx/html` : 이 장소에 파일을 넣어두면 Nginx가 알아서 Client에서 요청이 들어올 때 알맞은 정적파일을 제공해준다
이 장소는 설정을 통해서 바꿀 수 있다.  


실행은 

`docker run -p 8080:80 c9d403c8994b`

docker 는 기본적으로 80번 포트를 이용한다. 그에 따라 저런 식의 포트 매핑을 해 로컬에서 띄워볼 수 있도록 한다.

## travis 를 이용한 배포하기

travis와 연동을 하게 된 후 push 를 하게 되면 travi가 해당 소스코드를 가지고 가게 되는데
이후에 외부 클라우드 와 연동을 하는 등의 작업을 거쳐 배포를 하게 해주는 스크립트를 작성해야함
travis.yml에 작성하기.



현재 작성한 코드 기준

sudo : 관리자 권한 갖기

language : 언어를 선택

services : 도커 환경 구성

before_install : 스크립트 실행 전 실행할 스크립트

script : 실행할 스크립트

after_success: 테스트 성공 후 할 일

```yaml

```

## deploy

>배포를 위한 스크립트 추가

deploy : 배포용이라는 뜻

provider: 외부 서비스 (s3, elastic beans talk, firebase 등등)

region: AWS의 서비스가 위치하고 있는 물리적 장소

app: 생성된 어플리케이션의 이름

env: 환경이름 

bucket_name: s3 버킷이름    
: travis 에서 가지고 있는 파일을 압축해서 s3에 보내는 것...    
이걸 먼저 하고, Elestic beanstalkㄷ에 보낼 수 있음

우리가 elastic beanstalk 하나 생성을 하게 되면, 자동적으로 하나 버킷이 생성 

## fullstack application 만들기

리액트, 노드, 데이터베이스앱 개발   
(멀티 컨테이너)

컨테이너를 삭제하더라도 데이터베이스는 남아있게 제작


```
client --->> nginx(URL에 맞추어 리소스를 제공) --->> frontend ( nginx( 정적파일 제공 ) -> buildfile )
                                       --->> backend
```


