pipeline {
    agent any

    environment {
        EC2_USER = 'ec2-user'
        EC2_HOST = '3.94.152.221'
        DEST_DIR = '/home/ec2-user/API/backend'
        ARTIFACT_NAME = 'app.tar.gz'
        SSH_CREDENTIALS = '/var/jenkins_home/chave_jenkins.pem'
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
                def packageJson = readJSON file: '/var/jenkins_home/workspace/deploy-EC2/backend/package.json'
                env.APP_VERSION = packageJson.version
                echo "Versão extraída: ${env.APP_VERSION}"
            }
        }
    }

        stage('Check if version exists on EC2') {
            steps {
                script {
                    def result = sh(
                        script: """ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa ${EC2_USER}@${EC2_HOST} '[ -d "${RELEASE_DIR}" ] && echo "EXISTS" || echo "NEW"'""",
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
                    ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa ${EC2_USER}@${EC2_HOST} 'mkdir -p ${RELEASE_DIR}'
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
