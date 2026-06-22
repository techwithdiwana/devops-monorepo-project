pipeline {

    agent {
        label 'k8s-agent'
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'develop',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
            }
        }

        stage('Run Database Migration') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        pip install -r requirements.txt

                        export DB_HOST=mysql-service.helm-mysql-test.svc.cluster.local
                        export DB_PORT=3306
                        export DB_NAME=devopsdb
                        export DB_USER=root
                        export DB_PASSWORD=Root@123

                        python -m alembic upgrade head

                        python -m alembic current
                        '''
                    }
                }
            }
        }
    }

    post {

        success {

            echo "Database Migration Successful"
        }

        failure {

            echo "Database Migration Failed"
        }
    }
}