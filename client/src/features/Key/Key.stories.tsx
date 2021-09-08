import React from 'react';
import { Story } from '@storybook/react';

import { Key, KeyProps, Unicode as U, functions } from './index';

export default {
  title: 'Features/Key',
  component: Key
}

const Template: Story<KeyProps> = (args) => <Key {...args} />;

export const Text = Template.bind({});
Text.args = { label: 'Text' }

export const Icon = Template.bind({});
Icon.args = { label: 'fingerprint', icon: true }

export const Unicode = Template.bind({});
Unicode.args = { label: U.minus, unicode: true }

export const Functional = Template.bind({});
Functional.args = { label: functions.eX }