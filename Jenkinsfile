pipeline {
    agent any

    environment {
        EC2_IP = '3.88.90.213'
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'
        EC2_USER = 'ec2-user'
        PATH = "C:\\Program Files\\Git\\bin;C:\\Windows\\System32;${env.PATH}"
    }

    stages {
        stage('Deploy na EC2') {
            steps {
                script {
                    bat """
                    set "SSH_BASE=ssh -o StrictHostKeyChecking=no -i \\"${SSH_KEY_PATH}\\" ${EC2_USER}@${EC2_IP}"
                    set "CD_API=cd /home/${EC2_USER}/API/minha_api/backend"
                    set "PULL_INSTALL_RESTART=git pull && npm install"
                    set "RESTART_API=pm2 restart api || pm2 start index.js --name api"
                    "C:\\Program Files\\Git\\bin\\bash.exe" -c "%SSH_BASE% '%CD_API% && %PULL_INSTALL_RESTART% && %RESTART_API%'"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'API atualizada e reiniciada com sucesso na EC2!'
        }
        failure {
            echo 'Falha ao atualizar e reiniciar a API na EC2!'
        }
    }
}
