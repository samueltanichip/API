pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        EC2_IP = '54.242.241.68'
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'
        EC2_USER = 'ec2-user'
        REMOTE_PATH = '/home/ec2-user/API'
        ARTIFACT_NAME = 'api_artifact.zip'
        PATH = "C:\\Program Files\\Git\\bin;C:\\Windows\\System32;${env.PATH}"
    }

    stages {
        stage('Criar artefato') {
            steps {
                script {
                    bat """
                    powershell Compress-Archive -Path backend\\* -DestinationPath ${ARTIFACT_NAME} -Force
                    """
                }
            }
        }

        stage('Enviar artefato via SCP') {
            steps {
                script {
                    bat """
                    "C:\\Program Files\\Git\\bin\\scp.exe" -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no ${ARTIFACT_NAME} ${EC2_USER}@${EC2_IP}:${REMOTE_PATH}/${ARTIFACT_NAME}
                    """
                }
            }
        }

        stage('Deploy na EC2') {
            steps {
                script {
                    bat """
                    set "SSH_BASE=ssh -o StrictHostKeyChecking=no -i \\"${SSH_KEY_PATH}\\" ${EC2_USER}@${EC2_IP}"
                    set "DEPLOY_CMDS=cd ${REMOTE_PATH} && unzip -o ${ARTIFACT_NAME} -d ./ && cd backend && npm install && pm2 restart api || pm2 start index.js --name api"
                    "C:\\Program Files\\Git\\bin\\bash.exe" -c "%SSH_BASE% '%DEPLOY_CMDS%'"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy concluído com sucesso!'
        }
        failure {
            echo 'Falha no processo de deploy!'
        }
    }
}
