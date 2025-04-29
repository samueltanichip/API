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
                def packageJson = readJSON file: '/var/jenkins_home/workspace/deploy-EC2/backend/package.json'
                env.APP_VERSION = packageJson.version
                echo "Versão extraída: ${env.APP_VERSION}"
                env.RELEASE_DIR = "/home/ec2-user/API/backend/${env.APP_VERSION}"
                echo "Diretório de release: ${env.RELEASE_DIR}"
            }
        }
    }
    
         stage('Check if version exists on EC2') {
                steps {
                    script {
                        def releaseDir = "/home/ec2-user/API/backend/${env.APP_VERSION}"
                        def result = sh(
                            script: """ssh -o StrictHostKeyChecking=no -i /var/jenkins_home/chave_jenkins.pem ${EC2_USER}@${EC2_HOST} '[ -d "${releaseDir}" ] && echo "EXISTS" || echo "NEW"'""",
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
