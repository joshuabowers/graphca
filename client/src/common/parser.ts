import nearley from 'nearley';
import grammar from './grammar';

export interface Parser {
  input: string,
  output?: any[]
  error?: string
}

export const parse = (input: string): Parser => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar as unknown as nearley.CompiledRules));
  let output: any[] | undefined = undefined;
  let error: string | undefined = undefined;
  try {
    parser.feed(input);
    output = parser.results;
  } catch(err: any) {
    console.error(err)
    error = err
  }
  return {input, output, error};
}