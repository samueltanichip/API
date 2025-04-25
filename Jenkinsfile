pipeline {
    agent any

    environment {
        // Variáveis de ambiente
        EC2_SSH_USER = 'ec2-user'
        EC2_IP = '3.94.152.221'
        EC2_KEY_PATH = '/var/jenkins_home/chave_jenkins.pem'
        REMOTE_DIR = '/home/ec2-user/API'
        LOCAL_DIR = '/var/jenkins_home/workspace/deploy-EC2'
        GIT_REPO = 'https://github.com/samueltanichip/API.git'
        GIT_BRANCH = 'main'
        EC2_USER = 'ec2-user'
        EC2_HOST = '3.94.152.221'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    git url: "${env.GIT_REPO}", branch: "${env.GIT_BRANCH}"
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build || echo "Sem script build, continuando..."'
                }
            }
        }

        stage('Test SSH Connection') {
            steps {
                script {
                    sh "ssh -i ${EC2_KEY_PATH} -o StrictHostKeyChecking=no ${EC2_SSH_USER}@${EC2_IP} 'echo SSH connection successful!'"
                }
            }
        }

        stage('Transfer Files to EC2') {
            steps {
                script {
                    sh "scp -i ${EC2_KEY_PATH} -o StrictHostKeyChecking=no -r ${LOCAL_DIR} ${EC2_SSH_USER}@${EC2_IP}:${REMOTE_DIR}"
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    sh """
                        ssh -i ${EC2_KEY_PATH} -o StrictHostKeyChecking=no ${EC2_SSH_USER}@${EC2_IP} <<EOF
                        cd ${REMOTE_DIR}
                        npm install --production || true
                        pm2 restart app || pm2 start app.js
                        EOF
                    """
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    sh 'rm -rf build/ || true'
                }
            }
        }
    }
}
