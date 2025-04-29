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
                    def packageJson = readJSON file: 'backend/package.json'
                    env.APP_VERSION = packageJson.version
                    echo "Versão extraída: ${env.APP_VERSION}"
                }
            }
        }

        stage('Check if version exists on EC2') {
            steps {
                script {
                    def releaseDir = "/home/ec2-user/API/backend/${env.APP_VERSION}"
                    def result = sh(
                        script: """ssh -o StrictHostKeyChecking=no -i ${SSH_CREDENTIALS} ${EC2_USER}@${EC2_HOST} '[ -d "${releaseDir}" ] && echo "EXISTS" || echo "NEW"'""",
                        returnStdout: true
                    ).trim()

                    if (result == "EXISTS") {
                        echo "Versão ${env.APP_VERSION} já existe. Pulando deploy."
                        currentBuild.result = 'SUCCESS'
                        error("Deploy já realizado para esta versão.")
                    } else {
                        echo "Versão ${env.APP_VERSION} ainda não existe. Continuando deploy..."
                    }
                }
            }
        }

        stage('Create remote directory') {
            steps {
                script {
                    def releaseDir = "/home/ec2-user/API/backend/${env.APP_VERSION}"
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_CREDENTIALS} ${EC2_USER}@${EC2_HOST} 'mkdir -p ${releaseDir}'
                    """
                }
            }
        }

        stage('Compress and transfer app') {
            steps {
                script {
                    sh """
                        mkdir -p temp_dir
                        cp -r backend Jenkinsfile temp_dir/
                        tar -czf ${ARTIFACT_NAME} -C temp_dir .
                        rm -rf temp_dir
                        scp -o StrictHostKeyChecking=no -i ${SSH_CREDENTIALS} ${ARTIFACT_NAME} ${EC2_USER}@${EC2_HOST}:/home/ec2-user/API/backend/${env.APP_VERSION}/
                    """
                }
            }
        }

        stage('Extract on EC2') {
            steps {
                script {
                    def releaseDir = "/home/ec2-user/API/backend/${env.APP_VERSION}"
                    sh """
                        ssh -o StrictHostKeyChecking=no -i ${SSH_CREDENTIALS} ${EC2_USER}@${EC2_HOST} 'cd ${releaseDir} && tar -xzf ${ARTIFACT_NAME}'
                    """
                }
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
