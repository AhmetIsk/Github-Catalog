Feature: Repository Search
  Scenario: Search for a user repository by name
    Given the user is on the main page
    When the user searches for "AhmetIsk"
    Then the user search results should be displayed in the options of the autocomplete

    When the user selects "AhmetIsk" from the autocomplete
    Then the repository table for the selected user should be displayed

    When the user filters repositories by "EmptyRepo" text
    Then the repository table should display "No repositories found with the given filters" message

    When the user filters repositories by "JotForum" text
    Then the repository table should contain "JotForum Demo - Allows developers to have a comment forum without requiring any databases. Instead, comments are stored in " message

    When the user removes search filter
    And the user filters repositories by "JavaScript" programming language
    Then the repository table should contain only "JavaScript" programming language

    When the user presses "Include forks" switch button
    Then the "Is Fork" column is shown in repository table
