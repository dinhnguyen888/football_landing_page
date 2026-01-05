pipeline {
    agent any

    environment {
        APP_NAME    = 'football_landing_page'
        GITHUB_USER = 'dinhnguyen888'
        IMAGE_NAME  = "ghcr.io/${GITHUB_USER}/${APP_NAME}"
        IMAGE_TAG   = 'latest'
        CI          = 'false'
    }

    stages {

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat '''
                    npm install
                '''
            }
        }

        stage('Build React App') {
            steps {
                echo 'Building React application...'
                bat '''
                    npm run build
                '''
            }
        }

        stage('Docker Login GHCR') {
            steps {
                echo 'Logging into GitHub Container Registry...'
                withCredentials([
                    string(credentialsId: 'github-cicd-token', variable: 'GITHUB_TOKEN')
                ]) {
                    bat '''
                        echo %GITHUB_TOKEN% | docker login ghcr.io -u %GITHUB_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat '''
                    docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to GHCR...'
                bat '''
                    docker push %IMAGE_NAME%:%IMAGE_TAG%
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        cleanup {
            echo '🧹 Cleaning workspace...'
            cleanWs()
        }
    }
}
