import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import GithubListItem, { GithubListItemProps } from "./GithubListItem";

export default {
  title: "Components/GithubListItem",
  component: GithubListItem,
} as Meta;

const Template: StoryFn<GithubListItemProps> = (args) => <GithubListItem {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Sample Repository",
  description: "This is a sample description of a repository.",
  language: "JavaScript"
};
