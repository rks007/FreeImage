pipeline {
    agent any
    
    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Docker image tag to deploy')
    }
    
    stages {
        stage("Workspace cleanup") {
            steps {
                script {
                    cleanWs()
                }
            }
        }
        
        stage('Git checkout') {
            steps {
                git 'https://github.com/rks007/FreeImage.git'
            }
        }
        
        stage('Update App deployment.yaml') {
            steps {
                script {
                    sh """
                        sed -i 's|image: .*|image: ${params.IMAGE_TAG}|' kubernetes/app-deployment.yml
                    """
                    echo "Updated App-deployment.yaml with image: ${params.IMAGE_TAG}"
                }
            }
        }
        
        stage('Commit & Push Changes') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                        sh """
                            git config user.email "CD-bot@jenkins.com"
                            git config user.name "Jenkins CD"
                            git remote set-url origin https://${GIT_USER}:${GIT_TOKEN}@github.com/rks007/FreeImage.git
                            git add kubernetes/app-deployment.yml
                            git commit -m "Update app-deployment image to ${params.IMAGE_TAG}" || echo "No changes to commit"
                            git push origin master
                        """
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