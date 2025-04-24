pipeline {
    agent any

    environment {
        EC2_IP = '54.242.241.68'
        SSH_KEY_PATH = 'C:/Users/USER/Downloads/chave_jenkins.pem'
        EC2_USER = 'ec2-user'
        REMOTE_DEPLOY_BASE_DIR = '/home/ec2-user/API'  // Diretório base onde os subdiretórios estão localizados
        ARTIFACT_NAME = 'meu_artefato.zip'  // Nome do artefato gerado
        LOCAL_ARTIFACT_VERSION = '1.0.0'  // Exemplo de versão local do artefato
        PATH = "C:\\Program Files\\Git\\bin;C:\\Windows\\System32;${env.PATH}"  // Definindo o PATH com Git Bash
    }

    stages {
        stage('Verificar versão remota') {
            steps {
                script {
                    // Comando para verificar a versão do artefato remoto
                    def remoteVersion = bat(script: """
                        ssh -o StrictHostKeyChecking=no -i "${SSH_KEY_PATH}" ${EC2_USER}@${EC2_IP} 'cat ${REMOTE_DEPLOY_BASE_DIR}/version.txt'
                    """, returnStdout: true).trim()

                    // Comparar a versão remota com a versão local
                    if (remoteVersion == LOCAL_ARTIFACT_VERSION) {
                        echo "Versão já está atualizada. Nenhum deploy necessário."
                        currentBuild.result = 'SUCCESS'
                        return
                    } else {
                        echo "Nova versão encontrada. Iniciando deploy..."
                    }
                }
            }
        }

        stage('Fazer deploy nos subdiretórios') {
            steps {
                script {
                    bat """
                    set "SSH_BASE=ssh -o StrictHostKeyChecking=no -i \\"${SSH_KEY_PATH}\\" ${EC2_USER}@${EC2_IP}"
                    set "FIND_SUBDIRS=find ${REMOTE_DEPLOY_BASE_DIR} -type d"  // Comando para encontrar todos os subdiretórios
                    set "DEPLOY_CMD=unzip -o ${REMOTE_DEPLOY_BASE_DIR}/deploy/${ARTIFACT_NAME} -d"
                    
                    // Executando o deploy em cada subdiretório
                    "C:\\Program Files\\Git\\bin\\bash.exe" -c "%SSH_BASE% '%FIND_SUBDIRS% | while read dir; do %DEPLOY_CMD% $dir; done'"
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Deploy realizado com sucesso em todos os diretórios!'
        }
        failure {
            echo 'Falha ao realizar o deploy.'
        }
    }
}
