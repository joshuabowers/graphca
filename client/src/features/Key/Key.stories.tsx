import React from 'react';
import { Story } from '@storybook/react';

import { Key, KeyProps } from './index';
import { ModeProps } from '../Mode';
import { PI, H, Exponent } from '../Mode/Mode.stories'

export default {
  title: 'Features/Key',
  component: Key
}

const Template: Story<KeyProps> = (args) => <Key {...args} />;

export const ThreeState = Template.bind({});
ThreeState.args = {
  default: Exponent.args as ModeProps, 
  shift: PI.args as ModeProps, 
  alpha: H.args as ModeProps
}