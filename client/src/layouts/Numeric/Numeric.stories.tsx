import React from 'react';
import { Story } from '@storybook/react';

import { Numeric, NumericProps } from '.';

export default {
  title: 'Layouts/Numeric',
  component: Numeric
}

const Template: Story<NumericProps> = (args) => <Numeric {...args} />

export const Default = Template.bind({})