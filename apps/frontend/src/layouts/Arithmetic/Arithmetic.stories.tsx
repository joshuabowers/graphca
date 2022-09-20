import React from 'react';
import { Story } from '@storybook/react';

import { Arithmetic, ArithmeticProps } from '.';

export default {
  title: 'Layouts/Arithmetic',
  component: Arithmetic
}

const Template: Story<ArithmeticProps> = (args) => <Arithmetic {...args} />

export const Default = Template.bind({})