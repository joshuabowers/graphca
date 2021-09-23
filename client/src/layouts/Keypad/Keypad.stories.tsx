import React from 'react';
import { Story } from '@storybook/react';

import { Keypad, KeypadProps } from '.';

export default {
  title: 'Layouts/Keypad',
  component: Keypad
}

const Template: Story<KeypadProps> = (args) => <Keypad {...args} />

export const Default = Template.bind({})