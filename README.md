# Github-Catalog

This is a GitHub catalog that enables users to search for GitHub users, and also search & filter their repositories.

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js and npm installed on your machine.
- A GitHub personal access token for accessing the GitHub GraphQL API. Set this token in your environment variables as `REACT_APP_GITHUB_TOKEN`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Features

- **User Search**: Search for GitHub users by username using an autocomplete feature.
- **Repository Search and Filter**: Once a user is selected, search and filter their repositories by name and programming language.
- **Include Forks**: Option to include or exclude forked repositories in the search results.
- **Pagination**: Efficiently navigate through large sets of repositories with pagination support.
- **Multi-language Support**: The app supports English and German languages, allowing users to switch between them seamlessly.
- **Responsive Design**: The app is designed to be responsive and works well on both desktop and mobile devices.
- **Storybook Integration**: Components are documented and can be viewed in isolation using Storybook.
- **Testing**: The app includes unit and end-to-end tests to ensure reliability and correctness.

## Architecture

- **React**: The app is built using React, leveraging hooks and functional components for state management and UI rendering.
- **Apollo Client**: Used for interacting with the GitHub GraphQL API, providing a robust and efficient way to fetch data.
- **Material-UI**: Provides a set of React components for faster and easier web development.
- **React Intl**: Used for internationalization, allowing the app to support multiple languages.
- **Storybook**: Used for developing UI components in isolation for React.
- **Cucumber and Playwright**: Used for end-to-end testing to ensure the app behaves as expected.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This project uses the GitHub GraphQL API.
- Built with Create React App and Material-UI for styling.
