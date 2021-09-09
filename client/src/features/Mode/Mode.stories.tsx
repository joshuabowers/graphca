import React from 'react';
import { Story } from '@storybook/react';

import { Mode, ModeProps } from './index';
import { Unicode, functional } from '../../common/MathSymbols';

export default {
  title: 'Features/Mode',
  component: Mode
}

const Template: Story<ModeProps> = (args) => <Mode {...args} />;

export const PI = Template.bind({})
PI.args = {type: 'shift', display: Unicode.pi}

export const H = Template.bind({})
H.args = {type: 'alpha', display: 'H'}

export const Exponent = Template.bind({})
Exponent.args = {type: 'default', display: functional.xY, displayHint: 'functional'}
