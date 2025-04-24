pipeline {
    agent any

    stages {
        stage('Clonar Repositório') {
            steps {
                script {
                    checkout scm
                    // Caso precise de comandos git adicionais, use bat no Windows
                    bat 'git config core.sparseCheckout false'
                    bat 'git reset --hard HEAD'
                }
            }
        }

        stage('Criar artefato da pasta API') {
            steps {
                script {
                    bat """
                    if exist API (
                        cd API
                        "C:\\Program Files\\7-Zip\\7z.exe" a -tzip ..\\${ARTIFACT_NAME} *
                    ) else (
                        echo Pasta API não encontrada!
                        exit /b 1
                    )
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

        stage('Deploy na EC2 (descompactar e reiniciar)') {
            steps {
                script {
                    bat """
                    set "SSH_BASE=ssh -o StrictHostKeyChecking=no -i \\"${SSH_KEY_PATH}\\" ${EC2_USER}@${EC2_IP}"
                    set "DEPLOY_CMDS=cd ${REMOTE_PATH} && unzip -o ${ARTIFACT_NAME} && cd backend && npm install && pm2 restart api || pm2 start index.js --name api"
                    "C:\\Program Files\\Git\\bin\\bash.exe" -c "%SSH_BASE% '%DEPLOY_CMDS%'"
                    """
                }
            }
        }
    }
}
