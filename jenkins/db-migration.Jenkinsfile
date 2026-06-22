pipeline {

    agent {
        label 'k8s-agent'
    }

    environment {

        DB_HOST     = 'mysql-service.helm-mysql-test.svc.cluster.local'
        DB_PORT     = '3306'
        DB_NAME     = 'devopsdb'
        DB_USER     = 'root'
        DB_PASSWORD = 'Root@123'
    }

    stages {

        stage('Checkout') {

            steps {

                git branch: 'develop',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/techwithdiwana/devops-monorepo-project.git'
            }
        }

        stage('Install Dependencies') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        pip install -r requirements.txt
                        '''
                    }
                }
            }
        }

        stage('Debug Environment') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        echo "===== ENV VARIABLES ====="

                        echo "DB_HOST=$DB_HOST"
                        echo "DB_PORT=$DB_PORT"
                        echo "DB_NAME=$DB_NAME"
                        echo "DB_USER=$DB_USER"

                        echo "===== DATABASE.PY ====="

                        cat app/database.py

                        echo "===== ALEMBIC URL ====="

                        grep sqlalchemy.url alembic.ini || true
                        '''
                    }
                }
            }
        }

        stage('Current Alembic Version') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        python -m alembic current || true
                        '''
                    }
                }
            }
        }

        stage('Run Migration') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        python -m alembic upgrade head
                        '''
                    }
                }
            }
        }

        stage('Verify Migration') {

            steps {

                container('python') {

                    dir('auth-service') {

                        sh '''
                        python -m alembic current
                        '''
                    }
                }
            }
        }
    }

    post {

        success {

            echo 'Database Migration Successful'
        }

        failure {

            echo 'Database Migration Failed'
        }
    }
}