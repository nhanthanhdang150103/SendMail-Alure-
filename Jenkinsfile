pipeline {
    agent any
    tools {
        nodejs 'Node22' // Đảm bảo tên này khớp với cấu hình trong Jenkins Global Tool Configuration
        allure 'Allure_2.29.0' // Thêm Allure Commandline tool đã cấu hình trong Jenkins Global Tool Configuration
    }

    environment {
        BASE_URL = credentials('BASE_URL') // Sử dụng Jenkins Credentials để bảo mật
        LOGIN_USERNAME = credentials('LOGIN_USERNAME')
        LOGIN_PASSWORD = credentials('LOGIN_PASSWORD')
        HEADLESS_MODE = 'true'
        // CI = 'true'
        // Thêm DEBUG để có log chi tiết từ Playwright khi chạy trên Jenkins
        // DEBUG = 'pw:api' // Bỏ comment dòng này nếu muốn log API của Playwright
    }

    triggers {
        pollSCM('H/5 * * * *') // Kiểm tra SCM mỗi 5 phút
    }

    stages {
        stage('Install Dependencies') {
            steps {
                // Cài đặt dependencies và kiểm tra lỗi
                sh 'npm install --no-optional' // --no-optional để giảm nguy cơ lỗi phụ thuộc
            }
        }

        stage('Run Tests') {
            steps {
                // Chạy test và tạo các file kết quả Allure
                // Cucumber sẽ tự động đọc cấu hình từ file cucumber.json
                sh 'npx cucumber-js'
            }
        }

        stage('Generate Allure Report') {
            steps {
                // Tạo báo cáo HTML từ các file kết quả Allure
                sh 'allure generate allure-results --clean -o allure-report'
            }
        }

        stage('Archive Artifacts') {
            steps {
                // Lưu trữ báo cáo Allure và kết quả test (bao gồm trace và screenshot nếu có)
                archiveArtifacts artifacts: 'allure-results/**, allure-report/**, test-results/', allowEmptyArchive: true
                // Cấu hình Allure Report plugin trong Jenkins
                // Đảm bảo bạn đã cài đặt Allure Plugin trong Jenkins
                // Post-build action: "Publish Allure Report"
                // Path to results: allure-results
            }
        }
    }

    post {
        always {
            // Bước này sẽ tự động tìm kết quả và hiển thị báo cáo Allure trên trang build
            // Nó vẫn yêu cầu bạn phải cài đặt Allure Jenkins Plugin
            allure includeProperties: false, tool: 'Allure_2.29.0', report: 'allure-report', results: [[path: 'allure-results']]

            cleanWs() // Dọn dẹp workspace
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
