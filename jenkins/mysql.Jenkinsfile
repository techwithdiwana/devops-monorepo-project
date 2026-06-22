pipeline {

    agent {
        label 'k8s-agent'
    }

    environment {

        HELM_RELEASE   = 'mysql'
        HELM_NAMESPACE = 'helm-mysql-test'
        HELM_CHART     = 'helm/mysql'
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'develop',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
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

        stage('Helm Template Validation') {

            steps {

                container('helm') {

                    sh '''
                    helm template mysql ${HELM_CHART}
                    '''
                }
            }
        }

        stage('Helm Deploy') {

            steps {

                container('helm') {

                    sh '''
                    helm upgrade --install ${HELM_RELEASE} ${HELM_CHART} \
                    -n ${HELM_NAMESPACE}
                    '''
                }
            }
        }

        stage('Verify StatefulSet') {

            steps {

                container('helm') {

                    sh '''
                    kubectl rollout status statefulset/mysql \
                    -n ${HELM_NAMESPACE} \
                    --timeout=300s

                    kubectl get pods -n ${HELM_NAMESPACE}

                    kubectl get pvc -n ${HELM_NAMESPACE}

                    kubectl get svc -n ${HELM_NAMESPACE}
                    '''
                }
            }
        }
    }

    post {

        success {

            echo "MySQL Deployment Successful"
        }

        failure {

            echo "MySQL Deployment Failed"
        }
    }
}