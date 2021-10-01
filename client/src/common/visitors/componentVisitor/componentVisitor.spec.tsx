import React from 'react';
import { shallow, mount, render } from 'enzyme';

import { MathSymbols, Unicode } from '../../MathSymbols';
import { parser } from '../../parser';
import { componentVisitor } from '.';

describe('componentVisitor', () => {
  it('renders numbers', () => {
    const input = '1024';
    const output = parser.value(input, {visit: componentVisitor});
    expect(shallow(output).is('.number')).toBe(true);
    expect(shallow(output).text()).toEqual('1024');
  })

  it('renders binary operator expressions', () => {
    const input = '1 + 2 - 3 * 4 / 5';
    const output = parser.value(input, {visit: componentVisitor});
    const expected = `1 + 2 ${Unicode.minus} 3 ${Unicode.multiplication} 4 ${Unicode.division} 5`
    expect(shallow(output).is('.binaryOp')).toBe(true)
    expect(shallow(output).text()).toEqual(expected)
  })
})