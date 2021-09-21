import React from 'react';
import { Story } from '@storybook/react';

import { Calculator, CalculatorProps } from './index';

export default {
  title: 'Layouts/Calculator',
  component: Calculator
}

const Template: Story<CalculatorProps> = (args) => <Calculator {...args} />

export const Responsive = Template.bind({})