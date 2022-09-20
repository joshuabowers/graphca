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
H.args = {type: 'alphaMega', display: 'H'}

export const Exponent = Template.bind({})
Exponent.args = {type: 'default', display: functional.xY, displayHint: 'functional'}

export const Multiply = Template.bind({})
Multiply.args = {type: 'default', display: Unicode.multiplication}

export const R = Template.bind({})
R.args = {type: 'alphaMega', display: 'R'}

export const Shift = Template.bind({})
Shift.args = {type: 'default', display: Unicode.shift, displayHint: 'unicode'}

export const Alpha = Template.bind({})
Alpha.args = {type: 'default', display: 'Alpha'}

export const AlphaLock = Template.bind({})
AlphaLock.args = {type: 'shift', display: 'A-Lock'}