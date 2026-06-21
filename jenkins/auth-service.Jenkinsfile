pipeline {
    
agent {
    label 'k8s-agent'
}

environment {

    DOCKER_IMAGE   = 'techwithdiwana/auth-service'
    IMAGE_TAG      = "${BUILD_NUMBER}"

    HELM_RELEASE   = 'auth-service'
    HELM_NAMESPACE = 'helm-auth-test'
    HELM_CHART     = 'helm/auth-service'
}

stages {

    stage('Checkout') {

        steps {

            git branch: 'develop',
                credentialsId: 'github-creds',
                url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
        }
    }

    stage('Validate Auth Service') {

        steps {

            container('python') {

                dir('auth-service') {

                    sh '''
                    pip install -r requirements.txt

                    python -m py_compile app/main.py
                    '''
                }
            }
        }
    }

    stage('Build & Push Docker Image') {

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
                    set -ex

                    mkdir -p /kaniko/.docker

                    AUTH=$(echo -n "$DOCKER_USER:$DOCKER_PASS" | base64 | tr -d '\\n')

                    cat > /kaniko/.docker/config.json <<EOF
```

{
"auths": {
"https://index.docker.io/v1/": {
"auth": "$AUTH"
}
}
}
EOF

```
                    cat /kaniko/.docker/config.json

                    /kaniko/executor \
                      --verbosity=debug \
                      --context=$WORKSPACE/auth-service \
                      --dockerfile=$WORKSPACE/auth-service/Dockerfile \
                      --destination=${DOCKER_IMAGE}:${IMAGE_TAG}
                    '''
                }
            }
        }
    }

    stage('Helm Lint') {

        steps {

            container('helm') {

                sh '''
                helm lint ${HELM_CHART}
                '''
            }
        }
    }

    stage('Helm Deploy') {

        steps {

            container('helm') {

                sh '''
                helm upgrade --install ${HELM_RELEASE} ${HELM_CHART} \
                -n ${HELM_NAMESPACE} \
                --set image.repository=${DOCKER_IMAGE} \
                --set image.tag=${IMAGE_TAG}
                '''
            }
        }
    }

    stage('Verify Rollout') {

        steps {

            container('helm') {

                sh '''
                kubectl rollout status deployment/auth-service \
                -n ${HELM_NAMESPACE} \
                --timeout=300s

                kubectl get pods -n ${HELM_NAMESPACE}

                kubectl get svc -n ${HELM_NAMESPACE}

                kubectl logs deployment/auth-service \
                -n ${HELM_NAMESPACE} \
                --tail=20
                '''
            }
        }
    }
}

post {

    success {

        echo "Auth Service Deployment Successful"
        echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
    }

    failure {

        echo "Auth Service Deployment Failed"
    }
}

}
