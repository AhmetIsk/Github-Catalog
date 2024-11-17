import { Meta, StoryFn } from '@storybook/react';
import GithubSwitch from './GithubSwitch';

export default {
  title: 'Components/GithubSwitch',
  component: GithubSwitch,
} as Meta;

const Template: StoryFn = (args) => <GithubSwitch {...args} />;

export const Default = Template.bind({});
Default.args = {
  checked: false,
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const CheckedAndDisabled = Template.bind({});
CheckedAndDisabled.args = {
  checked: true,
  disabled: true,
};
