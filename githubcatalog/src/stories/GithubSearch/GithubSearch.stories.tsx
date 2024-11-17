import { Meta, StoryFn } from "@storybook/react";
import { MockedProvider } from "@apollo/client/testing";
import GithubSearch, { GithubSearchProps } from "./GithubSearch";
import { GET_USERNAMES } from "../../graphql/queries";
import { IntlProvider } from "react-intl";
import enMessages from "../../translations/en.json";

const mocks = [
  {
    request: {
      query: GET_USERNAMES,
      variables: { query: "dart" },
    },
    result: {
      data: {
        search: {
          nodes: [
            { login: "randomuser1" },
            { login: "randomuser2" },
          ],
        },
      },
    },
  },
];

export default {
  title: "Components/GithubSearch",
  component: GithubSearch,
} as Meta;

const Template: StoryFn<GithubSearchProps> = (args) => (
  <IntlProvider locale="en" messages={enMessages}>
    <MockedProvider mocks={mocks} addTypename={false}>
      <GithubSearch {...args} />
    </MockedProvider>
  </IntlProvider>
);

export const Default = Template.bind({});
Default.args = {
  handleUsernameSelect: (username) => console.log("Selected username:", username),
  selectedUsername: null,
};
