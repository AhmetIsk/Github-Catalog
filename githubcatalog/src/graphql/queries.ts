import { gql } from "@apollo/client";

export const GET_USER_REPOSITORIES = gql`
query SearchRepositories($query: String!, $first: Int!, $after: String) {
  search(query: $query, type: REPOSITORY, first: $first, after: $after) {
    edges {
      node {
        ... on Repository {
          name
          description
          primaryLanguage {
            name
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    repositoryCount
  }
}
`;

export const GET_USERNAMES = gql`
  query GetUsernames($query: String!) {
    search(query: $query, type: USER, first: 10) {
      nodes {
        ... on User {
          login
        }
      }
    }
  }
`;

// export const GET_REPOSITORIES_FILTERED = gql`
//   query SearchRepositories(
//     $query: String!
//     $first: Int!
//     $after: String
//   ) {
//     search(query: $query, type: REPOSITORY, first: $first, after: $after) {
//       repositoryCount
//       edges {
//         node {
//           ... on Repository {
//             name
//             description
//             primaryLanguage {
//               name
//             }
//           }
//         }
//       }
//       pageInfo {
//         endCursor
//       hasNextPage
//     }
//     }
//   }
// `;