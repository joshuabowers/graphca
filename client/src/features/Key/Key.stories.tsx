import React from 'react';
import { Story } from '@storybook/react';

import { Key, KeyProps } from './index';
import { ModeProps } from '../Mode';
import { PI, H, Exponent, Shift, Alpha, AlphaLock, Multiply, R } from '../Mode/Mode.stories'

export default {
  title: 'Features/Key',
  component: Key
}

const Template: Story<KeyProps> = (args) => <Key {...args} />;

export const Singleton = Template.bind({});
Singleton.args = {
  default: Shift.args as ModeProps
}

export const TwoStateShift = Template.bind({});
TwoStateShift.args = {
  default: Alpha.args as ModeProps,
  shift: AlphaLock.args as ModeProps
}

export const TwoStateAlpha = Template.bind({});
TwoStateAlpha.args = {
  default: Multiply.args as ModeProps,
  alpha: R.args as ModeProps
}

export const ThreeState = Template.bind({});
ThreeState.args = {
  default: Exponent.args as ModeProps, 
  shift: PI.args as ModeProps, 
  alpha: H.args as ModeProps
}