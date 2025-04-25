pipeline {
    agent any

    triggers {
        pollSCM('* * * * *')
    }

    environment {
        EC2_IP = '3.94.152.221'
        SSH_KEY_PATH = '/home/usuario/Downloads/chave_jenkins.pem'  // Caminho para sua chave no Linux
        EC2_USER = 'ec2-user'
        REMOTE_PATH = '/home/ec2-user/API'
        ARTIFACT_NAME = 'api_artifact.zip'
        DEPLOY_DIR = '/home/usuario/jenkins/workspace/deploy_EC2'  // Caminho para o diretório de trabalho no Linux
    }

    stages {
        stage('Verificar Diretório API') {
            steps {
                script {
                    echo "Verificando diretório do repositório: ${pwd()}"
                }
            }
        }

        stage('Criar artefato da pasta deploy_EC2') {
            steps {
                script {
                    sh """
                    cd ${DEPLOY_DIR}
                    if [ -f ${ARTIFACT_NAME} ]; then rm ${ARTIFACT_NAME}; fi
                    zip -r ${ARTIFACT_NAME} *
                    """
                }
            }
        }

        stage('Enviar artefato via SCP') {
            steps {
                script {
                    sh """
                    scp -i "${SSH_KEY_PATH}" -o StrictHostKeyChecking=no ${DEPLOY_DIR}/${ARTIFACT_NAME} ${EC2_USER}@${EC2_IP}:${REMOTE_PATH}/${ARTIFACT_NAME}
                    """
                }
            }
        }

        stage('Deploy na EC2') {
            steps {
                script {
                    sh """
                    SSH_BASE="ssh -o StrictHostKeyChecking=no -i ${SSH_KEY_PATH} ${EC2_USER}@${EC2_IP}"
                    CD_API="cd ${REMOTE_PATH}/minha_api/backend"
                    PULL_INSTALL_RESTART="git pull && npm install"
                    RESTART_API="pm2 restart api || pm2 start index.js --name api"
                    ${SSH_BASE} '${CD_API} && ${PULL_INSTALL_RESTART} && ${RESTART_API}'
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
