import React from 'react';
import { Story } from '@storybook/react';

import { Functional, FunctionalProps } from '.';

export default {
  title: 'Layouts/Functional',
  component: Functional
}

const Template: Story<FunctionalProps> = (args) => <Functional {...args} />

export const Default = Template.bind({})