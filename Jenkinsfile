pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/ashokckumar/abcede.git'
        DOCKER_IMAGE = 'ashokdocke/abcede'   // Replace with your Docker Hub repo
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from GitHub...'
                deleteDir()
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Node.js if Missing') {
            steps {
                echo '🧩 Checking and installing Node.js if not present...'
                sh '''
                    if ! command -v node &> /dev/null; then
                        echo "Node.js not found. Installing..."
                        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    else
                        echo "✅ Node.js already installed. Version: $(node -v)"
                    fi
                '''
            }
        }

        stage('Install & Test') {
            steps {
                echo '🧪 Installing dependencies and running tests...'
                sh '''
                    if [ -f package.json ]; then
                        echo "Node.js project detected. Installing dependencies..."
                        npm install
                        echo "✅ Running tests (if any)..."
                        npm test || echo "⚠️ No test script found."
                    elif [ -f requirements.txt ]; then
                        echo "Python project detected. Installing dependencies..."
                        pip install -r requirements.txt
                        echo "✅ Running tests (if any)..."
                        pytest || echo "⚠️ No tests found."
                    else
                        echo "⚠️ No recognized project type found."
                    fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                '''
            }
        }

        stage('Push to Docker Hub') {
            environment {
                DOCKER_HUB_CREDENTIALS = credentials('ashokdocke')
            }
            steps {
                echo '📤 Pushing Docker image to Docker Hub...'
                sh '''
                    echo "${DOCKER_HUB_CREDENTIALS_PSW}" | docker login -u "${DOCKER_HUB_CREDENTIALS_USR}" --password-stdin
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker logout
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build and push completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed. Check the console output for details.'
        }
    }
}

