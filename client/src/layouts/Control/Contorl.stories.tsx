import React from "react";
import { Story } from "@storybook/react";

import { Control, ControlProps } from ".";

export default {
  title: 'Layouts/Control',
  component: Control
}

const Template: Story<ControlProps> = (args) => <Control {...args} />

export const Default = Template.bind({})