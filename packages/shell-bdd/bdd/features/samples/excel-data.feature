Feature: As a User, I should be able test Excel Data Reader Utility

  Scenario: As a User, I should be able load data from excel and test the data with jsonpath
    Given User loads data from "SampleTest.xlsx" excel file
      | SheetName     | assginedAttribute |
      | Users         | users             |
      | Organizations | organizations     |
    Then User verifies excel data with path "$.users[0].firstName" and value as "Test"
    Then User verifies excel data with path "$.users[0].lastName" and value as "User"
    Then User verifies excel data with path "$.users[1].firstName" and value as "Pradeep"
    Then User verifies excel data with path "$.users[1].lastName" and value as "Kariyappa"
    Then User verifies excel data with path "$.organizations[0].organizationName" and value as "Boxmart"
    Then User verifies excel data with path "$.organizations[0].organizationCode" and value as "BOXMART"

  Scenario Outline: As a User, I should be able load data from excel and test the data with jsonpath
    Given User loads data from "SampleTest.xlsx" excel file
      | SheetName | assginedAttribute |
      | Users     | users             |
    Then User verifies excel data with path "$.users[<rowId>].firstName" and value as "<firstName>"
    Then User verifies excel data with path "$.users[<rowId>].lastName" and value as "<lastName>"

    Examples:
      | rowId | firstName | lastName  |
      |     0 | Test      | User      |
      |     1 | Pradeep   | Kariyappa |

  Scenario: As a User, I should be able pass data to step using excel data
    Given User navigates to the application
    And User logs into the application as [SYSTEM_ADMIN] and lands into "My Organization" [Login]
    And User loads data from "SampleTest.xlsx" excel file
      | SheetName     | assginedAttribute |
      | Users         | users             |
      | Organizations | organizations     |
    And User navigates to "My Organization" under "Manage" [App-Nav]
    Then User verifies "DEFAULT Organization" page is displayed [Page]["organization-details"]
    Then User verifies "edit" image is visible [Page]["organization-details"]
    Then User verifies "DEFAULT Organization" page is displayed [Page]["organization-add-edit"]
    Then User verifies excel data with path "$.organizations[0].addressLine1" and value as "MyHome"
    Then User updates field "addressLine1" of type [TextInput] with value "EGL Tech Park Domlur" in [Form]["organization"]
    Then User updates field "addressLine1" of type [TextInput] with value "$.organizations[0].addressLine1" in [Form]["organization"]
    When User clicks on "Cancel" action in [Page]["organization-add-edit"]
    Then User verifies "DEFAULT Organization" page is displayed [Page]["organization-details"]
