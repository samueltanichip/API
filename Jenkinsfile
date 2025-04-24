pipeline {
    agent any

    environment {
        EC2_IP = '54.242.241.68'
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'
        EC2_USER = 'ec2-user'
        LOCAL_API_PATH = 'C:/caminho/para/sua/api'
        ARTIFACT_NAME = 'api.zip'
        REMOTE_DEPLOY_DIR = '/home/ec2-user/API/minha_api/backend'
        REMOTE_TEMP_DIR = '/home/ec2-user/deploy'
        BASH = '"C:\\Program Files\\Git\\bin\\bash.exe"'
    }

    stages {
        stage('Gerar artefato') {
            steps {
                script {
                    bat """
                    powershell Compress-Archive -Path '${LOCAL_API_PATH}\\*' -DestinationPath '${ARTIFACT_NAME}' -Force
                    certutil -hashfile ${ARTIFACT_NAME} SHA256 > artifact.hash
                    """
                }
            }
        }

        stage('Verificar versão remota') {
            steps {
                script {
                    bat """
                    REM Garante que a pasta temporária exista
                    ${BASH} -c "ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'mkdir -p ${REMOTE_TEMP_DIR}'"

                    REM Envia o hash para EC2
                    ${BASH} -c "scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no artifact.hash ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/artifact_local.hash"

                    REM Compara hash remoto x local
                    ${BASH} -c "ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        if [ -f ${REMOTE_TEMP_DIR}/artifact.hash ] && cmp -s ${REMOTE_TEMP_DIR}/artifact.hash ${REMOTE_TEMP_DIR}/artifact_local.hash; then
                            echo EQUAL > ${REMOTE_TEMP_DIR}/result.txt;
                        else
                            echo DIFFERENT > ${REMOTE_TEMP_DIR}/result.txt;
                        fi
                    '"

                    REM Baixa resultado da comparação
                    ${BASH} -c "scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/result.txt result.txt"
                    """
                }
            }
        }

        stage('Deploy se versão diferente') {
            when {
                expression {
                    return readFile('result.txt').trim() == 'DIFFERENT'
                }
            }
            steps {
                script {
                    bat """
                    REM Envia artefato zip para EC2
                    ${BASH} -c "scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${ARTIFACT_NAME} ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/"

                    REM Acessa EC2 e faz deploy no repositório real
                    ${BASH} -c "ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        unzip -o ${REMOTE_TEMP_DIR}/${ARTIFACT_NAME} -d ${REMOTE_DEPLOY_DIR} &&
                        cd ${REMOTE_DEPLOY_DIR} &&
                        npm install &&
                        pm2 restart api || pm2 start index.js --name api &&
                        mv ${REMOTE_TEMP_DIR}/artifact_local.hash ${REMOTE_TEMP_DIR}/artifact.hash
                    '"
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
            echo 'Erro durante o processo de deploy.'
        }
    }
}
