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
                    env.APP_VERSION = packageJson.version
                    env.RELEASE_DIR = "/var/jenkins_home/workspace/deploy-EC2/backend/${env.APP_VERSION}"
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
                sh """
                    tar -czf ${ARTIFACT_NAME} .
                    scp -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa ${ARTIFACT_NAME} ${EC2_USER}@${EC2_HOST}:${RELEASE_DIR}/
                """
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
