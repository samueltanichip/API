pipeline {
    agent any

    environment {
        EC2_IP = '3.88.90.213'  // Substitua pelo IP da sua EC2
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'  // Caminho para sua chave privada SSH
        EC2_USER = 'ec2-user'  // Usuário padrão para instâncias EC2 com Amazon Linux
    }

    stages {
        stage('Create Directory on EC2') {
            steps {
                script {
                    // Comando para criar a pasta na EC2 via SSH
                    bat """
                    powershell -Command "ssh -i '${SSH_KEY_PATH}' ${EC2_USER}@${EC2_IP} 'mkdir -p /home/${EC2_USER}/test_folder'"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pasta criada com sucesso na EC2!'
        }
        failure {
            echo 'Falha ao criar a pasta na EC2!'
        }
    }
}
