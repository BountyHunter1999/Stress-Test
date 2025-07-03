pipeline {
  agent none
  stages {
    stage('Web') {
      parallel {
        stage('Web') {
          steps {
            node(label: 'Job 1') {
              node(label: 'Job')
            }

            node(label: 'w2')
            node(label: 'w3')
          }
        }

        stage('Protocol') {
          steps {
            build '1'
            node(label: 'p1') {
              sleep 2
              sleep 3
            }

            node(label: 'p2')
            node(label: 'p3')
          }
        }

      }
    }

  }
}