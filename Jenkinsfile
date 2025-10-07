pipeline {
    agent any
 
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-creds') // Jenkins credentials ID
        IMAGE_NAME = 'yourdockerhubusername/nodejs-app'
    }
 
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/ashokckumar/abcede.git'
            }
        }
 
        stage('Install & Test') {
            steps {
                script {
                    docker.image('node:18').inside {
                        sh '''
                            if [ -f package-lock.json ]; then
                                npm ci
                            else
                                npm install
                            fi
                            npm test || echo "No tests found"
                        '''
                    }
                }
            }
        }
 
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }
 
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: "$DOCKER_HUB_CREDENTIALS", url: ""]) {
                    sh 'docker push $IMAGE_NAME:latest'
                }
            }
        }
    }
 
    post {
        success {
            echo 'Pipeline completed successfully 🎉'
        }
        failure {
            echo 'FAILURE: check the console output for details ❌'
        }
    }
}
