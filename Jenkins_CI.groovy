pipeline {
    agent any
    
    stages {
        stage('Git Clone Project') {
            steps {
                git 'https://github.com/rks007/FreeImage.git'
            }
        }
        
        stage('Gitleaks Scan') {
            steps {
                sh 'gitleaks detect --source . --report-path gitleaks-report.json --no-git --exit-code 1'
            }
        }
        
        stage('trivy Scan') {
            steps {
                sh 'trivy fs --exit-code 1 --severity HIGH,CRITICAL --format table -o fs-report.html .'
            }
        }
        
        stage('Build-Tag & Push Docker Image') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred') {
                        COMMIT_SHA = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                        sh "docker build -t rks007/freeimage:${COMMIT_SHA} ."
                        sh "trivy image --format table -o freeimageapp-image-report.html rks007/freeimage:${COMMIT_SHA}"
                        
                        // Fail build if HIGH/CRITICAL vulnerabilities found
                        sh "trivy image --exit-code 0 --severity HIGH,CRITICAL rks007/freeimage:${COMMIT_SHA}"
                        sh "docker push rks007/freeimage:${COMMIT_SHA}"
                        
                        // Save Image Tag into env so post section can use it
                        env.IMAGE_TAG = "rks007/freeimage:${COMMIT_SHA}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            emailext(
                to: 'rksinghofficial007@gmail.com',
                subject: "✅ SUCCESS: Job '${env.JOB_NAME} [#${env.BUILD_NUMBER}]'",
                body: """
                    <h2 style="color:green;">✅ Build Successful</h2>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> #${env.BUILD_NUMBER}</p>
                    <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><b>Duration:</b> ${currentBuild.durationString}</p>
                    <hr/>
                    <p style="color:gray;">This is an automated notification from Jenkins.</p>
                """,
                mimeType: 'text/html'
            )
            
            // Trigger CD job after CI succeeds
            build job: 'CD-freeimage', parameters: [
                string(name: 'IMAGE_TAG', value: "${env.IMAGE_TAG}")
            ]
        }
        
        failure {
            emailext(
                to: 'rksinghofficial007@gmail.com',
                subject: "❌ FAILURE: Job '${env.JOB_NAME} [#${env.BUILD_NUMBER}]'",
                body: """
                    <h2 style="color:red;">❌ Build Failed</h2>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> #${env.BUILD_NUMBER}</p>
                    <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    <p><b>Duration:</b> ${currentBuild.durationString}</p>
                    <p><b>Cause:</b> ${currentBuild.getBuildCauses().toString()}</p>
                    <hr/>
                    <p style="color:gray;">Please check the Jenkins console log for details.</p>
                """,
                mimeType: 'text/html'
            )
        }
        
        always {
            archiveArtifacts artifacts: '*.html, *.json', onlyIfSuccessful: false
            // store the gitleaks and trivy file
            echo "Build finished with status: ${currentBuild.currentResult}"
        }
    }
}