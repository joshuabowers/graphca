import React from 'react';
import { Story } from '@storybook/react';

import { ToggleKey, ToggleKeyProps } from '.';
import { Unicode } from '../../common/MathSymbols';
import { ModeType, ModeProps } from '../Mode';

export default {
  title: 'Features/ToggleKey',
  component: ToggleKey
}

const Template: Story<ToggleKeyProps> = (args) => <ToggleKey {...args} />

export const Default = Template.bind({})
Default.args = {
  modes: new Map<ModeType, ModeProps>([
    ['default', {type: 'default', display: 'ALT'}]
  ])
}

export const Toggled = Template.bind({})
Toggled.args = {
  toggled: true,
  modes: new Map<ModeType, ModeProps>([
    ['default', {type: 'default', display: Unicode.shift, displayHint: 'unicode'}]
  ])
}

export const NotToggled = Template.bind({})
NotToggled.args = {
  toggled: false,
  modes: new Map<ModeType, ModeProps>([
    ['default', {type: 'default', display: Unicode.alphaMega, displayHint: 'unicode'}]
  ])
}