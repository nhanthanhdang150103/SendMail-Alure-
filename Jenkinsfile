pipeline {
    agent any
    tools {
        nodejs 'Node22'
        allure 'Allure_2.29.0' // Ensure this name matches your Jenkins Global Tool Configuration
    }

    environment {
        BASE_URL = credentials('BASE_URL')
        LOGIN_USERNAME = credentials('LOGIN_USERNAME')
        LOGIN_PASSWORD = credentials('LOGIN_PASSWORD')
        HEADLESS_MODE = 'true'
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install --no-optional'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def authResult = sh(script: 'npx playwright test --project=setup', returnStatus: true)
                    if (authResult != 0) {
                        error 'Playwright authentication setup failed.'
                    }
                }
                sh 'npx cucumber-js || true'
            }
        }

        stage('Generate Allure Report') { // Renamed for clarity
            steps {
                // Ensure the allure tool's bin directory is on the PATH for this step
                withTools([allure('Allure_2.29.0')]) { // Use withTools to ensure allure is in PATH
                    sh 'allure generate allure-results --clean -o allure-report'
                }
            }
        }

        stage('Archive Artifacts') { // Separated Archive Artifacts
            steps {
                archiveArtifacts artifacts: 'allure-results/**, allure-report/**, test-results/', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // This is the Jenkins Allure plugin's step, which correctly finds the tool.
            allure includeProperties: false, results: [[path: 'allure-results']]

            cleanWs()
        }
        success {
            script {
                echo 'Build successful!'
                mail(to: 'nhanthanhdang2003@gmail.com',
                     subject: "Jenkins Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} - SUCCESS",
                     body: "Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} passed successfully.\nCheck build details at: ${env.BUILD_URL}")
            }
        }
        failure {
            script {
                echo 'Build failed.'
                mail(to: 'nhanthanhdang2003@gmail.com',
                     subject: "Jenkins Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} - FAILED",
                     body: "Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} failed.\nCheck console output at: ${env.BUILD_URL}")
            }
        }
        unstable {
            script {
                echo 'Build unstable, likely due to test failures.'
                mail(to: 'nhanthanhdang2003@gmail.com',
                     subject: "Jenkins Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} - UNSTABLE",
                     body: "Build ${env.JOB_NAME} - ${env.BUILD_NUMBER} is unstable (likely due to test failures).\nCheck build details at: ${env.BUILD_URL}")
            }
        }
    }
}