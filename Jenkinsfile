pipeline {
    agent any

    environment {
        GIT_REPO = 'https://github.com/samueltanichip/API.git'  // URL do seu repositório Git
        GIT_BRANCH = 'main'  // Substitua com a branch que você deseja usar (main ou master)
    }

    stages {
        stage('Clonar Repositório') {
            steps {
                script {
                    // Clona o repositório Git especificado
                    git url: "${env.GIT_REPO}", branch: "${env.GIT_BRANCH}"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizada!'
        }
    }
}
