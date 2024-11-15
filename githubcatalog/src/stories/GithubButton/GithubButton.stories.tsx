import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import GithubButton, { GithubButtonProps } from "./GithubButton";

export default {
  title: "Components/GithubButton",
  component: GithubButton,
} as Meta;

const Template: StoryFn<GithubButtonProps> = (args) => <GithubButton {...args} />;

export const Default = Template.bind({});
Default.args = { children: "Click Me" };
