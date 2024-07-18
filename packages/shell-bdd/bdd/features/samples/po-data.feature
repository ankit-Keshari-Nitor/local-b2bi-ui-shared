Feature: As a User, I should be able test PO Data Reader Utility

  Scenario: As a User, I should be able load data from POs and test the data with jsonpath
    Given User loads data from PageObject files
      | filePath               | assginedAttribute   |
      | OrganizationAddEdit.js | organizationAddEdit |
    Then User verifies po data with path "#.organizationAddEdit.addressLine1" and value as "addressLine1"
