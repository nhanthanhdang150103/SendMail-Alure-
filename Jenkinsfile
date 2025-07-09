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

        stage('Generate Allure Report') {
            steps {
                // Ensure the allure tool's bin directory is on the PATH for this step
                // This is needed for 'allure generate' command
                withTools([allure('Allure_2.29.0')]) {
                    sh 'allure generate allure-results --clean -o allure-report'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'allure-results/**, allure-report/**, test-results/', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // Re-check the syntax for the 'allure' step.
            // The problem might stem from a subtle interaction with the 'tools' definition.
            // Let's try explicitly naming the tool within the 'allure' step parameters,
            // even though it's typically inferred. This can sometimes resolve
            // ambiguity if other Allure tools are defined or if there's a
            // versioning nuance.
            allure(
                tool: 'Allure_2.29.0', // Explicitly specify the tool ID
                includeProperties: false,
                results: [[path: 'allure-results']]
            )

            cleanWs()
        }
        success {
            script {
                echo 'Build successful!'
                mail(to: 'nhanthanhdang2003@gmail0.com',
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