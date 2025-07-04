# Configure Jenkins

1. Install `generic-webhook-trigger` plugin
2. In bitbucket, go to `Settings` -> `Webhooks` -> `Add webhook`
3. Add the following webhook:
   - Payload URL: `https://jenkins.example.com/generic-webhook-trigger/invoke`
     - `https://jenkins.example.com/generic-webhook-trigger/invoke?token=1234567890`
   - Content type: `application/json`
   <!-- - Secret: `1234567890` -->
   - Trigger: `Push events`
4. In jenkins, create a freestyle project
5. In triggers section, toggle `Generic Webhook Trigger`
6. In Post content parameters, add the following:
   - Branch
     - Variable: branch
     - Expression: `$.push.changes[0].new.name`
     - `JSONPath`
   - Repo:
     - Variable: repo
     - Expression: `$.repository.name`
     - `JSONPath`
7. Add the token you added in step 3, this must be the same as the one in the payload URL
8. Optional Filter
   - Expression, enter `<branch_name> <repo_name>`
   - Text field enter the variable name we assigned before as `$branch` and `$repo`
