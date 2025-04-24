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
        GIT_BASH_PATH = 'C:/Program Files/Git/bin/bash.exe'
    }

    stages {
        stage('Gerar artefato') {
            steps {
                script {
                    bat """
                    rm -f ${ARTIFACT_NAME} artifact.hash || true
                    zip -r '${ARTIFACT_NAME}' '${LOCAL_API_PATH}'/*
                    sha256sum '${ARTIFACT_NAME}' | awk '{print \$1}' > artifact.hash
                    """
                }
            }
        }

        stage('Verificar versão remota') {
            steps {
                script {
                    bat """
                    # Usando o Git Bash para executar o comando SSH e SCP
                    "${GIT_BASH_PATH}" -c "
                    # Garante que a pasta remota exista
                    ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} 'mkdir -p ${REMOTE_TEMP_DIR}'

                    # Envia hash local
                    scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no artifact.hash ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/artifact_local.hash

                    # Compara hashes na EC2
                    ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        if [ -f ${REMOTE_TEMP_DIR}/artifact.hash ] && cmp -s ${REMOTE_TEMP_DIR}/artifact.hash ${REMOTE_TEMP_DIR}/artifact_local.hash; then
                            echo EQUAL > ${REMOTE_TEMP_DIR}/result.txt;
                        else
                            echo DIFFERENT > ${REMOTE_TEMP_DIR}/result.txt;
                        fi
                    '

                    # Baixa resultado da comparação
                    scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/result.txt result.txt
                    "
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
                    # Usando o Git Bash para executar o comando SCP e SSH
                    "${GIT_BASH_PATH}" -c "
                    # Envia artefato zipado
                    scp -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${ARTIFACT_NAME} ${EC2_USER}@${EC2_IP}:${REMOTE_TEMP_DIR}/

                    # Descompacta direto no repositório e reinicia a API
                    ssh -i '${SSH_KEY_PATH}' -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '
                        unzip -o ${REMOTE_TEMP_DIR}/${ARTIFACT_NAME} -d ${REMOTE_DEPLOY_DIR} &&
                        cd ${REMOTE_DEPLOY_DIR} &&
                        npm install &&
                        pm2 restart api || pm2 start index.js --name api &&
                        mv ${REMOTE_TEMP_DIR}/artifact_local.hash ${REMOTE_TEMP_DIR}/artifact.hash &&
                        rm -f ${REMOTE_TEMP_DIR}/api.zip ${REMOTE_TEMP_DIR}/result.txt
                    '
                    "
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deploy concluído com sucesso!'
        }
        failure {
            echo '❌ Falha no processo de deploy.'
        }
    }
}
