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
                    \"C:\\Program Files\\Git\\bin\\bash.exe\" -c "ssh -o StrictHostKeyChecking=no -i 'C:/Users/USER/Downloads/chave_jenkins.pem' ec2-user@3.88.90.213 \\\"cd /home/ec2-user/API && git pull && npm install && pm2 restart all\\\""
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'API atualizada com sucesso na EC2!'
        }
        failure {
            echo 'Falha ao atualizar e iniciar a API na EC2!'
        }
    }
}
