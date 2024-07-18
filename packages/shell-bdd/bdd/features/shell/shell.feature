Feature: Test Shell Features

  Background:
    Given User navigates to the application
    And User logs into the application as [ORGANIZATION_ADMIN] and lands into "Dashboard" [Login]

  @JIRA:B2BISFG-68702 @Shell:Toast
  Scenario: As a User, I should be able to see notifications as toasts
    Given User navigates to "Feature Test" under "Shell Test" [App-Nav]
    And User verifies "Shell Feature Test" page is displayed [Page]["shell-feature-test"]
    When User clicks on "showSuccessToast" button in [Page]["shell-feature-test"]
    Then User verifies [success] notification with message "Success Message" is [visible] [Notification]['toast']
    When User waits for 12000 seconds for application to process
    Then User verifies [success] notification with message "Success Message" is [hidden] [Notification]['toast']
    When User clicks on "showSuccessToast" button in [Page]["shell-feature-test"]
    Then User verifies [success] notification with message "Success Message" is [visible] [Notification]['toast']
    When User clicks on "close" action in [Notification]["toast"]
    Then User verifies [success] notification with message "Success Message" is [hidden] [Notification]['toast']

  Scenario: As a User, I should be able to verify form fields
    Given User navigates to "Form Test" under "Shell Test" [App-Nav]
    And User verifies "Form Test" page is displayed [Page]["shell-form-test"]
    Then User verifies field "toggleStatus" of type [Toggle] has value "false" in [Form]["test"]
    When User updates field "toggleStatus" of type [Toggle] with value "false" in [Form]["test"]
    Then User verifies field "toggleStatus" of type [Toggle] has value "false" in [Form]["test"]
    When User updates field "toggleStatus" of type [Toggle] with value "true" in [Form]["test"]
    Then User verifies field "toggleStatus" of type [Toggle] has value "true" in [Form]["test"]
    When User updates field "toggleStatus" of type [Toggle] with value "true" in [Form]["test"]
    Then User verifies field "toggleStatus" of type [Toggle] has value "true" in [Form]["test"]
    Then User verifies field "toggleStatus" of type [Toggle] with label "toggle-status" is [visible] in [Form]["test"]
    Then User verifies form fields in [Form]["test"]
      | name         | formFieldType | label         | elementStatus |
      | toggleStatus | Toggle        | toggle-status | visible       |

  Scenario: As a User, I should be able to upload file
    Given User navigates to "Form Test" under "Shell Test" [App-Nav]
    And User verifies "Form Test" page is displayed [Page]["shell-form-test"]
    When User updates field "fileUpload2" of type [FileInput] with value "sshAuthorizedUserKey.secsh" in [Form]["test"]
    Then User verifies field "fileUpload2" of type [FileInput] has value "sshAuthorizedUserKey.secsh" in [Form]["test"]

  Scenario: As a User, I should be able to use Fitlerrable Multi selects
    Given User navigates to "Form Test" under "Shell Test" [App-Nav]
    And User verifies "Form Test" page is displayed [Page]["shell-form-test"]
    Then User verifies field "multiSelect" of type [MultiSelect] has value "Morning" in [Form]["test"]
    When User updates field "multiSelect" of type [MultiSelect] with value "Afternoon|Evening" in [Form]["test"]
    Then User verifies field "multiSelect" of type [MultiSelect] has value "Afternoon|Evening" in [Form]["test"]


  Scenario: As a User, I should be ablt to use Radio button
    Given User navigates to "Form Test" under "Shell Test" [App-Nav]
    And User verifies "Form Test" page is displayed [Page]["shell-form-test"]
    Then User verifies field "status" of type [RadioGroup] has value "Active" in [Form]["test"]
    When User updates field "status" of type [RadioGroup] with value "Inactive" in [Form]["test"]
    Then User verifies field "status" of type [RadioGroup] has value "Inactive" in [Form]["test"]
