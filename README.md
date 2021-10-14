## 💁‍♀️AWS 제공하는 CI/CD 솔루션

- CodeCommit

```
먼저 기존 코드를 Github에서 AWS CodeCommit으로 마이그레이션 한다. 
AWS CodeCommit은 AWS에서 호스팅하는 버전 제어 서비스로 클라우드에서 자산을 비공개로 저장하고 관리하는 데 사용한다.
```

- CodeBuild

```
애플리케이션 코드를 빌드하기 위해 CodeBuild를 구성한다. 
AWS CodeBuild는 소스 코드를 컴파일하고 테스트를 실행하며 배포 준비가 된 소프트웨어 패키지를 생성하는 완전히 관리된다.
```

- CodeDeploy

```
코드를 EC2 서버에 배포한다. 
AWS CodeDeploy는 Amazon EC2 인스턴스, 온 프레미스 인스턴스 또는 서버리스 Lambda 기능에 대한 애플리케이션 배포를 자동화하는 배포 서비스이다.
```

- CodePipeline

```
코드를 지속적으로 제공하는 파이프 라인을 구축한다. 
AWS CodePipeline은 소프트웨어 배포에 필요한 단계를 모델링, 시각화 및 자동화하는 데 사용할 수 있는 지속적인 제공 서비스이다. 
코드를 프로덕션에 전달하기 전에 파이프 라인에 승인 프로세스를 통합한다.
```
![image](https://user-images.githubusercontent.com/66551410/137365599-70b5f59a-82d9-475e-87df-cb35d40c24bb.png)
