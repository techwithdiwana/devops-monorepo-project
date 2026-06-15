pipeline {

```
agent {
    label 'k8s-agent'
}

environment {
    DOCKER_IMAGE = 'techwithdiwana/frontend'
    IMAGE_TAG = 'test'
}

stages {

    stage('Checkout') {

        steps {

            git branch: 'develop',
                credentialsId: 'github-creds',
                url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
        }
    }

    stage('Frontend Build') {

        steps {

            container('node') {

                dir('frontend') {

                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
    }

    stage('Archive Frontend Artifact') {

        steps {

            archiveArtifacts artifacts: 'frontend/dist/**'
        }
    }

    stage('Auth Service Validation') {

        steps {

            container('python') {

                dir('auth-service') {

                    sh 'python --version'
                    sh 'pip install -r requirements.txt'
                }
            }
        }
    }

    stage('Verify Dockerfile') {

        steps {

            container('kaniko') {

                sh 'echo WORKSPACE=$WORKSPACE'
                sh 'pwd'
                sh 'ls -la $WORKSPACE/frontend'
            }
        }
    }

    stage('Build & Push Frontend Image') {

        steps {

            container('kaniko') {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {

                    sh '''
                    mkdir -p /kaniko/.docker

                    AUTH=$(echo -n "$DOCKER_USER:$DOCKER_PASS" | base64 | tr -d '\\n')

                    cat > /kaniko/.docker/config.json <<EOF
                    {
                      "auths": {
                        "https://index.docker.io/v1/": {
                          "auth": "$AUTH"
                        }
                      }
                    }
                    EOF

                    /kaniko/executor \
                      --context=$WORKSPACE/frontend \
                      --dockerfile=$WORKSPACE/frontend/Dockerfile \
                      --destination=${DOCKER_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }

    stage('Deploy Frontend') {

        steps {

            container('kubectl') {

                sh '''
                kubectl apply -f k8s/frontend/deployment.yaml

                kubectl rollout status deployment/frontend --timeout=120s

                kubectl get deployment frontend

                kubectl get pods -l app=frontend
                '''
            }
        }
    }
}

post {

    success {
        echo 'Frontend image successfully built, pushed and deployed'
    }

    failure {
        echo 'Pipeline failed'
    }
}
```

}
