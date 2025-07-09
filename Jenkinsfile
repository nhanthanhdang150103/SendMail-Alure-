pipeline {
    agent any
    tools {
        nodejs 'Node22'
        allure 'Allure_2.29.0'
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
                // Ensure auth setup runs successfully
                script {
                    def authResult = sh(script: 'npx playwright test --project=setup', returnStatus: true)
                    if (authResult != 0) {
                        error 'Playwright authentication setup failed.'
                    }
                }
                // Run Cucumber tests
                // We run cucumber-js and allow it to fail (return non-zero exit code)
                // The Allure post-build step will correctly interpret the results
                // and set the build status (success, unstable, failure).
                // We add '|| true' here just to ensure this specific step doesn't abort the pipeline immediately,
                // allowing the 'allure generate' and post-build actions to run.
                // However, given your logs show all PASSED, it should already be exiting with 0.
                // The real issue might be related to artifacts or the allure generation itself,
                // or a very subtle timing/race condition with Jenkins.
                sh 'npx cucumber-js || true'
            }
        }

        stage('Generate and Archive Report') { // Changed stage name for clarity
            steps {
                // Generate Allure report first
                sh 'allure generate allure-results --clean -o allure-report'

                // Archive the generated report and results
                archiveArtifacts artifacts: 'allure-results/**, allure-report/**, test-results/', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            // This line automatically picks up allure-results and publishes the report.
            // It will also set the build status (success, unstable, failure) based on the test results.
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