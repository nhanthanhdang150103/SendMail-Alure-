Feature: Project Management

  Scenario Outline: Add new project with various inputs
    Given I am logged in and on the project page
    When I add a project with title "<title>", client "<client>", estimated hours "<hours>", priority "<priority>", start date "<startDate>", end date "<endDate>", summary "<summary>", and team "<team>"
    Then I should see the project <result> message "<message>"

    Examples:
      | title        | client            | hours | priority | startDate         | endDate | summary                                                                 | team          | result  | message                                     |
      | Project A    | Pham Trung Kien   | 100   | Highest  | 01-07-2025        | 15      | This is a detailed summary over 60 characters for success case.         | Admin Example | success | Project added.                              |
      |              | Pham Trung Kien   | 80    | Normal   | 01-07-2025        | 15      | Summary here is valid too.                                              | Admin Example | error   | The title field is required.                |
     
