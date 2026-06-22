pipeline {

    agent any

    stages {

        stage('Deploy MySQL') {
            steps {
                build job: 'mysql-stg', wait: true
            }
        }

        stage('Deploy Auth Service') {
            steps {
                build job: 'auth-service-stg', wait: true
            }
        }

        stage('Deploy API Gateway') {
            steps {
                build job: 'api-gateway-stg', wait: true
            }
        }

        stage('Deploy Frontend') {
            steps {
                build job: 'frontend-stg', wait: true
            }
        }
    }

    post {

        success {
            echo 'Platform Deployment Successful'
        }

        failure {
            echo 'Platform Deployment Failed'
        }
    }
}