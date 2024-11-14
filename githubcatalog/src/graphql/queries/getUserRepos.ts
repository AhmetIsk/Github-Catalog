import { gql } from "@apollo/client";

export const GET_USER_REPOS = gql`
  query GetUserRepos($username: String!) {
    user(login: $username) {
      repositories(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          id
          name
          description
          primaryLanguage {
            name
          }
        }
      }
    }
  }
`;
