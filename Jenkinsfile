pipeline {
    agent any

    environment {
        EC2_USER = 'ec2-user'
        EC2_HOST = '3.94.152.221'
        DEST_DIR = '/home/ec2-user/API/backend'
        ARTIFACT_NAME = 'app.tar.gz'
        SSH_CREDENTIALS = '/var/jenkins_home/chave_jenkins.pem'
        RELEASE_DIR = "/home/ec2-user/API/backend/${env.APP_VERSION}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Extract version from package.json') {
    steps {
        script {
            // Corrige o caminho para o package.json
            def packageJson = readJSON file: '/var/jenkins_home/workspace/deploy-EC2/backend/package.json'
            
            // Verifica se a versão foi lida corretamente
            echo "Conteúdo do package.json: ${packageJson}"

            // Atribui a versão ao ambiente
            env.APP_VERSION = packageJson.version
            
            // Verifica se a versão foi extraída corretamente
            if (!env.APP_VERSION) {
                error("Versão não encontrada no package.json.")
            }

            env.RELEASE_DIR = "/var/jenkins_home/workspace/deploy-EC2/backend/${env.APP_VERSION}"

            // Exibe a versão e diretório
            echo "Versão: ${env.APP_VERSION}, diretório de release: ${env.RELEASE_DIR}"
        }
    }
}

        stage('Check if version exists on EC2') {
            steps {
                script {
                    def result = sh(
                        script: """ssh -o StrictHostKeyChecking=no -i /var/jenkins_home/chave_jenkins.pem ${EC2_USER}@${EC2_HOST} '[ -d "${RELEASE_DIR}" ] && echo "EXISTS" || echo "NEW"'""",
                        returnStdout: true
                    ).trim()

                    if (result == "EXISTS") {
                        echo "Versão ${APP_VERSION} já existe. Pulando deploy."
                        currentBuild.result = 'SUCCESS'
                        error("Deploy já realizado para esta versão.")
                    } else {
                        echo "Versão ${APP_VERSION} ainda não existe. Continuando deploy..."
                    }
                }
            }
        }

        stage('Create remote directory') {
            steps {
                sh """
                    ssh -o StrictHostKeyChecking=no -i /var/jenkins_home/chave_jenkins.pem ${EC2_USER}@${EC2_HOST} 'mkdir -p ${RELEASE_DIR}'
                """
            }
        }

           stage('Compress and transfer app') {
        steps {
            script {
                // Cria um diretório temporário para evitar conflito com arquivos sendo alterados
                sh """
                    mkdir -p temp_dir
                    cp -r * temp_dir/
                    tar -czf ${ARTIFACT_NAME} -C temp_dir .
                    rm -rf temp_dir
                """
            }
        }
    }

     stage('Extract on EC2') {
            steps {
                sh """
                    ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa ${EC2_USER}@${EC2_HOST} 'cd ${RELEASE_DIR} && tar -xzf ${ARTIFACT_NAME}'
                """
            }
        }
    }

    post {
        always {
            script {
                echo "Pipeline finalizada. Versão extraída: ${env.APP_VERSION ?: 'desconhecida'}"
            }
        }
    }
}
