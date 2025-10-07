pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials-id')
        IMAGE_NAME = 'ashokdocke/wiki'
        IMAGE_TAG = "latest"
        REPO_URL = 'https://github.com/ashokckumar/abcede.git'
    }

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Detect default branch dynamically
                    def defaultBranch = sh(script: "git ls-remote --symref ${REPO_URL} HEAD | grep HEAD | awk '{print \$2}' | sed 's|refs/heads/||'", returnStdout: true).trim()
                    echo "Default branch detected: ${defaultBranch}"
                    
                    // Checkout that branch
                    git branch: defaultBranch, url: "${REPO_URL}"
                }
            }
        }

        stage('Install & Test') {
            steps {
                echo 'Installing dependencies and running tests...'
                sh '''
                    if [ -f package.json ]; then
                        npm install
                        npm test || echo "Tests failed, but continuing"
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                withDockerRegistry([credentialsId: 'docker-hub-credentials-id', url: '']) {
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
    }
}

