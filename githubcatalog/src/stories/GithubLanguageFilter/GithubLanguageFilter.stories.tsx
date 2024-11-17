import { Meta, StoryFn } from '@storybook/react';
import GithubLanguageFilter from './GithubLanguageFilter';
import { IntlProvider } from 'react-intl';
import enMessages from '../../translations/en.json';

export default {
  title: 'Components/GithubLanguageFilter',
  component: GithubLanguageFilter,
} as Meta;


const Template: StoryFn = (args) => (
  <IntlProvider locale="en" messages={enMessages}>
    <GithubLanguageFilter {...args} onChange={args.onChange} />
  </IntlProvider>
);

export const Default = Template.bind({});
Default.args = {
  onChange: (languages: string[]) => console.log('Selected languages:', languages),
};
