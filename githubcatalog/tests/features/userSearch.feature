Feature: User Search
  Scenario: Search for a user by username
    Given the user is on the main page
    When the user searches for "AhmetIsk"
    Then the user search results should be displayed in the options of the autocomplete

    When the user selects "AhmetIsk" from the autocomplete
    Then the repository table for the selected user should be displayed