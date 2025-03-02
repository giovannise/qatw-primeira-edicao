pipeline {
    agent {
        docker {
            //image 'mcr.microsoft.com/playwright:v1.50.1-noble' //<-imagem com playwright
            image 'papitodev/playwright-nj-v1.50.1-noble' //imagem com playwright e java
            args '--network qatw-primeira-edicao_skynet'
        }
    }

    stages {
        stage('Node.js Deps') { //dependencias do node
            steps {
                sh 'npm install' //sh = shell script | npm install vai instalar lá no servidor do docker as dependencias do node que estãao no package.json
            }
        }
        stage('E2E Tests') {
            steps {
                sh 'npx playwright test' //exatamente o que já executamos no bash para executar a automação dos testes
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }
}
