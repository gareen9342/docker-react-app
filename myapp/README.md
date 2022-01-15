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



