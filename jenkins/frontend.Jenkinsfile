pipeline {

agent {
    label 'k8s-agent'
}

environment {

    DOCKER_IMAGE   = 'techwithdiwana/frontend'
    IMAGE_TAG      = "${BUILD_NUMBER}"

    HELM_RELEASE   = 'frontend'
    HELM_NAMESPACE = 'helm-test'
    HELM_CHART     = 'helm/frontend'
}

stages {

    stage('Checkout') {

        steps {

            git branch: 'develop',
                credentialsId: 'github-creds',
                url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
        }
    }

    stage('Build Frontend') {

        steps {

            container('node') {

                dir('frontend') {

                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }
    }

mkdir -p /kaniko/.docker

AUTH=$(echo -n "$DOCKER_USER:$DOCKER_PASS" | base64 | tr -d '\n')

cat > /kaniko/.docker/config.json <<EOF
{
  "auths": {
    "https://index.docker.io/v1/": {
      "auth": "$AUTH"
    }
  }
}
EOF

echo "===== Docker Config ====="
cat /kaniko/.docker/config.json

/kaniko/executor \
  --verbosity=debug \
  --context=$WORKSPACE/frontend \
  --dockerfile=$WORKSPACE/frontend/Dockerfile \
  --destination=${DOCKER_IMAGE}:${IMAGE_TAG}

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
                kubectl rollout status deployment/frontend \
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

        echo "Deployment Successful"
        echo "Image: ${DOCKER_IMAGE}:${IMAGE_TAG}"
    }

    failure {

        echo "Deployment Failed"
    }
}

}
