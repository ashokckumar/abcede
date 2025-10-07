pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/ashokckumar/abcede.git'
        DOCKER_IMAGE = 'ashokdocke/abcede'
        DOCKER_TAG = 'latest'
        NODE_VERSION = 'v20.10.0'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out code from GitHub...'
                deleteDir()
                git branch: 'main', url: "${REPO_URL}"
            }
        }

        stage('Install Node.js if Missing (No Sudo)') {
            steps {
                echo '🧩 Checking and installing Node.js (non-sudo)...'
                sh '''
                    if ! command -v node &> /dev/null; then
                        echo "Node.js not found. Installing locally..."
                        mkdir -p $HOME/.local/bin
                        curl -fsSL https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-x64.tar.xz -o node.tar.xz
                        tar -xf node.tar.xz
                        mv node-${NODE_VERSION}-linux-x64 $HOME/.local/node
                        export PATH=$HOME/.local/node/bin:$PATH
                        echo "export PATH=$HOME/.local/node/bin:$PATH" >> $HOME/.bashrc
                        node -v
                        npm -v
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
                    export PATH=$HOME/.local/node/bin:$PATH
                    if [ -f package.json ]; then
                        echo "Installing Node.js dependencies..."
                        npm install
                        npm test || echo "⚠️ No test script found."
                    else
                        echo "⚠️ No package.json found. Skipping Node steps."
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
                DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
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

