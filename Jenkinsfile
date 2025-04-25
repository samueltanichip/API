pipeline {
    agent any
    
    environment {
        EC2_USER = 'ec2-user'  // Usuário da sua EC2
        EC2_HOST = '3.94.152.221'  // IP público da sua instância EC2
        EC2_KEY_PATH = '/mnt/c/users/USER/Downloads/chave_jenkins.pem'  // Caminho para sua chave SSH no container
    }

    stages {
        stage('Test SSH Connection') {
            steps {
                script {
                    // Comando SSH para testar a conexão
                    sh """
                        ssh -i ${EC2_KEY_PATH} -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} 'echo "SSH Connection successful!"'
                    """
                }
            }
        }
    }
}
