import { Meta, StoryFn } from "@storybook/react";
import GithubTextField, { GithubTextFieldProps } from "./GithubTextField";

export default {
  title: "Components/GithubTextField",
  component: GithubTextField,
} as Meta;

const Template: StoryFn<GithubTextFieldProps> = (args) => <GithubTextField {...args} />;

export const Default = Template.bind({});
Default.args = { label: "Enter text", placeholder: "Type something..." };
