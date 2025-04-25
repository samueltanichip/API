pipeline {
    agent any

    environment {
        // Variáveis de ambiente
        EC2_SSH_USER = 'ec2-user'  // Usuário para acessar a EC2 (pode ser 'ubuntu' ou outro dependendo da AMI)
        EC2_IP = '3.94.152.221'  // IP público da sua instância EC2
        EC2_KEY_PATH = 'C:\Users\USER\Downloads\chave_jenkins.pem'  // Caminho para sua chave privada SSH (no Jenkins)
        REMOTE_DIR = '/home/ec2-user/API'  // Diretório remoto onde os arquivos serão colocados na EC2
        LOCAL_DIR = '/root/jenkins_data/workspace/deploy-EC2'  // Diretório local contendo os arquivos de build
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    // Clone o repositório do código fonte, ou obtenha os artefatos que você precisa para o deploy
                    git 'https://github.com/samueltanichip/API.git'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Aqui você pode adicionar um processo de build, por exemplo, com npm ou yarn
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Transfer Files to EC2') {
            steps {
                script {
                    // Utilizando SCP para transferir os arquivos de build para a EC2
                    sh "scp -i ${EC2_KEY_PATH} -r ${LOCAL_DIR} ${EC2_SSH_USER}@${EC2_IP}:${REMOTE_DIR}"
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    // Conectar via SSH e rodar o comando de deploy na EC2 (pode ser reiniciar o serviço ou rodar um script)
                    sh """
                    ssh -i ${EC2_KEY_PATH} ${EC2_SSH_USER}@${EC2_IP} 'bash -s' <<EOF
                    cd ${REMOTE_DIR}
                    # Aqui você pode rodar o comando para iniciar ou reiniciar a aplicação, como:
                    npm install --production
                    pm2 restart app || pm2 start app.js
                    EOF
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Realiza a limpeza do workspace se necessário
                    sh 'rm -rf build/'
                }
            }
        }
    }
}
