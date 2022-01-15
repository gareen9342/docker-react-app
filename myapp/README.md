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




