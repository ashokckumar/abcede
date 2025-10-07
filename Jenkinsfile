pipeline {
  agent any
 
  environment {
    // Create this credential in Jenkins (username/password or token) and replace below ID
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
    DOCKER_IMAGE = 'ashokdocke' // <-- replace with your Docker Hub username/repo
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }
 
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
 
    stage('Install & Test') {
      steps {
        script {
          // run tests inside official node image (so Jenkins agent doesn't need node installed)
          docker.image('node:18').inside('--user root') {
            sh 'npm ci'
            sh 'npm test'
          }
        }
      }
    }
 
    stage('Build Docker Image') {
      steps {
        // Jenkins agent must have docker CLI & daemon (or run on node that has Docker)
        sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
      }
    }
 
    stage('Push to Docker Hub') {
      steps {
        // DOCKERHUB_CREDENTIALS must be added in Jenkins (username/password or username/token)
        withCredentials([usernamePassword(credentialsId: "${DOCKERHUB_CREDENTIALS}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
          // tag as latest and push (optional)
          sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest || true"
          sh "docker push ${DOCKER_IMAGE}:latest || true"
        }
      }
    }
  }
 
  post {
    success {
      echo "SUCCESS: pushed ${DOCKER_IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "FAILURE: check the console output for details"
    }
  }
}
