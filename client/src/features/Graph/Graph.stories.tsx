import React from 'react';
import { Story } from '@storybook/react';

import { Graph, GraphProps } from '.';

export default {
  title: 'Features/Graph',
  component: Graph
}

const Template: Story<GraphProps> = (args) => <Graph {...args} />

export const Default = Template.bind({})