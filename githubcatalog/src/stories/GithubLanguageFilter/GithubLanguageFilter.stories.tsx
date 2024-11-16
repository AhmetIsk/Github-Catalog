import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react';
import GithubLanguageFilter from './GithubLanguageFilter';

export default {
  title: 'Components/GithubLanguageFilter',
  component: GithubLanguageFilter,
} as Meta;


const Template: StoryFn = (args) => <GithubLanguageFilter {...args} onChange={args.onChange} />;

export const Default = Template.bind({});
Default.args = {
  onChange: (languages: string[]) => console.log('Selected languages:', languages),
};

export const WithSelectedLanguages = Template.bind({});
WithSelectedLanguages.args = {
  onChange: (languages: string[]) => console.log('Selected languages:', languages),
};