import React from 'react';
import { Story } from '@storybook/react';

import { Terminal, TerminalProps } from '.';

export default {
  title: 'Features/Terminal',
  component: Terminal
}

const Template: Story<TerminalProps> = (args) => <Terminal {...args} />

export const NoHistory = Terminal.bind({})

export const History = Terminal.bind({})