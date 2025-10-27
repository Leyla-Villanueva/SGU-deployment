pipeline {
    agent any
    
    environment {
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {

        stage('Parando los servicios...') {
            steps {
                sh '''
                    docker compose -p demo down || true
                '''
            }
        }


        stage('Eliminando imágenes anteriores...') {
            steps {
                sh '''
                    IMAGES=$(docker images --filter "label=com.docker.compose.project=demo" -q)
                    if [-n "$IMAGES" ]; then
                        docker rmi -f $IMAGES
                    else
                        echo "No hay imágenes para eliminar"
                    fi
                '''
            }
        }


        stage('Obteniendo actualización...') {
            steps {
                checkout scm
            }
        }


        stage('Construyendo y desplegando servicios...') {
            steps {
                sh '''
                    docker compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado con éxito'
        }

        failure {
            echo 'Hubo un error al ejecutar el pipeline'
        }

        always {
            echo 'Pipeline finalizado'
        }
    }
    
}

