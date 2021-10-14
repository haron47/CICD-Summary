## 🏚CI / CD 아키텍쳐

![image](https://user-images.githubusercontent.com/66551410/137348776-6bdfbebc-b83e-4903-823e-02d1a1f950eb.png)

- afterInstall.bash

```sh
# DockerHub에 있는 Image는 차후 GitHub Action을 사용해서 git push를 할 때마다 새로운 image를 build 하여 갱신시켜줄 것입니다.
# 환경변수는 .gitignore에 등록하여 GitHub에 업로드 되지 않으므로 Docker Container를 가동시킬 때 따로 주입해줍니다.
# 환경변수가 담긴 파일은 별도로 EC2 instance 내에 직접 작성해주셔야 합니다.
```

- CI.yml

```yml
# Docker Image를 자동으로 build하고 push합니다.
# Docker Hub ID와 PW는 GitHub settings에 있는 secrets에 저장해둡니다.
# [Your DockerHub ID]/[Your Repository Name] 예시) dal96k/woomin-facebook
      - name: Docker image build and push
        uses: docker/build-push-action@v1
        with:
          username: ${{ secrets.DOCKER_ID }}
          password: ${{ secrets.DOCKER_PW }}
          repository: [Your DockerHub ID]/[Your Repository Name]
          tags: latest

# Docker Hub에 새로운 Image가 push 완료되면 CodeDeploy Agent가 동작되도록 합니다.
# --application-name과 --deployment-group-name은 아까 작성하신 애플리케이션 이름과 그룹 이름으로 대체하시면 됩니다.
# [Your GitHub Repository] 예시) Woomin-Jeon/facebook-clone-server
# "commitId=${GITHUB_SHA}" 코드가 자동으로 최신 commit을 불러옵니다.
# 아까 보관해두었던 AWS_ACCESS_KEY_ID와 AWS_SECRET_ACCESS_KEY는 GitHub secrets에 저장해둡니다.
      - name: Trigger the CodeDeploy in EC2 instance
        run: aws deploy --region ap-northeast-2 create-deployment --application-name CodeDeploy-application-example --deployment-config-name CodeDeployDefault.OneAtATime --deployment-group-name CodeDeploy-group-example --github-location repository=[Your GitHub Repository],commitId=${GITHUB_SHA}
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          Default_region_name: ap-northeast-2
```
