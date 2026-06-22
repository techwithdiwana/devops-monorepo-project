pipeline {

    agent {
        label 'k8s-agent'
    }

    environment {

        DOCKER_IMAGE   = 'techwithdiwana/api-gateway'
        IMAGE_TAG      = "${BUILD_NUMBER}"

        HELM_RELEASE   = 'api-gateway'
        HELM_NAMESPACE = 'helm-api-test'
        HELM_CHART     = 'helm/api-gateway'
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'develop',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
            }
        }

        stage('Build API Gateway') {

            steps {

                container('node') {

                    dir('api-gateway') {

                        sh '''
                        npm install
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
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "$AUTH"
    }
  }
}
EOF

                        /kaniko/executor \
                          --context=$WORKSPACE/api-gateway \
                          --dockerfile=$WORKSPACE/api-gateway/Dockerfile \
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
                    kubectl rollout status deployment/api-gateway \
                    -n ${HELM_NAMESPACE} \
                    --timeout=300s

                    kubectl get pods -n ${HELM_NAMESPACE}

                    kubectl get svc -n ${HELM_NAMESPACE}
                    '''
                }
            }
        }
    }

    post {

        success {

            echo "API Gateway Deployment Successful"
            echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
        }

        failure {

            echo "API Gateway Deployment Failed"
        }
    }
}