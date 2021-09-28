import nearley from 'nearley';
// import grammar from './grammar';

export interface Parser {
  input: string
}

export const parse = (input: string): Parser => {
  return {input};
}