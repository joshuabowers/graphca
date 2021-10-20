import React from 'react';
import { Story } from '@storybook/react';

import { Togglable, TogglableProps } from '.';

export default {
  title: 'Layouts/Togglable',
  component: Togglable
}

const Template: Story<TogglableProps> = (args) => <Togglable {...args} />

export const Default = Template.bind({})