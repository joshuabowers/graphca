import React from "react";
import { Story } from "@storybook/react";

import { KeyGroup, KeyGroupProps } from ".";
import { Key, KeyProps } from '../Key';
import { Singleton, TwoStateShift, TwoStateAlpha, ThreeState } from "../Key/Key.stories";

export default {
  title: 'Features/KeyGroup',
  component: KeyGroup
}

const Template: Story<KeyGroupProps> = (args) => (
  <KeyGroup {...args}>
    <Key {...Singleton.args as KeyProps} />
    <Key {...TwoStateShift.args as KeyProps} />
    <Key {...TwoStateAlpha.args as KeyProps} />
    <Key {...ThreeState.args as KeyProps} />
  </KeyGroup>
)

export const Horizontal = Template.bind({})
Horizontal.args = { layout: 'horizontal' }

export const Vertical = Template.bind({})
Vertical.args = { layout: 'vertical' }

export const Square = Template.bind({})
Square.args = { layout: 'square' }