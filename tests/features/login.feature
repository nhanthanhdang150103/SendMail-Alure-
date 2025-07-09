Feature: Login Functionality
  @no-auth
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I login with valid credentials
    Then I should see the success message "Logged In Successfully."
  @no-auth
  Scenario: Failed login with invalid credentials
    Given I am on the login page
    When I login with username "wronguser" and password "wrongpass"
    Then I should see the error message "Invalid Login Credentials."