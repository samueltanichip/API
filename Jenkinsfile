pipeline {
    agent any

    environment {
        EC2_IP = '3.88.90.213'
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'
        EC2_USER = 'ec2-user'
        PATH = "C:\\Program Files\\Git\\bin;C:\\Windows\\System32;${env.PATH}"
    }

    stages {
        stage('Atualizar e Startar API na EC2') {
            steps {
                script {
                    bat """
                    \"C:\\Program Files\\Git\\bin\\bash.exe\" -c "ssh -o StrictHostKeyChecking=no -i '${SSH_KEY_PATH}' ${EC2_USER}@${EC2_IP} '
                        cd /home/${EC2_USER}/API &&
                        git pull origin main &&
                        npm install &&
                        npm start &'"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'API atualizada e iniciada com sucesso na EC2!'
        }
        failure {
            echo 'Falha ao atualizar e iniciar a API na EC2!'
        }
    }
}
