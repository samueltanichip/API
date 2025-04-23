pipeline {
    agent any

    environment {
        EC2_IP = '3.88.90.213'  // Substitua pelo IP da sua EC2
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'  // Caminho para sua chave privada SSH
        EC2_USER = 'ec2-user'  // Usuário padrão para instâncias EC2 com Amazon Linux
        PATH = "C:\\Program Files\\Git\\bin;C:\\Windows\\System32;${env.PATH}"
    }

    stages {
        stage('Create Directory on EC2') {
            steps {
                script {
                    // Usando Git Bash para executar o SSH com StrictHostKeyChecking desligado
                    bat """
                    \"C:\\Program Files\\Git\\bin\\bash.exe\" -c "ssh -o StrictHostKeyChecking=no -i '${SSH_KEY_PATH}' ${EC2_USER}@${EC2_IP} 'mkdir -p /home/${EC2_USER}/test_folder'"
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
