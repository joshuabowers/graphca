import chalk from 'chalk';
import { Request, Response, NextFunction } from 'express';

const timestamp = chalk.yellow;
const method = chalk.bold.cyan;
const uri = chalk.underline.cyan;
const data = chalk.bold.green;

export default async function logger( req: Request, res: Response, next: NextFunction ) {
  const out = `\n${ timestamp( new Date().toUTCString() ) }: ${ method( req.method ) } ${ uri( req.originalUrl ) }`;
  console.log( out );
  if( Object.keys(req.headers).length ){
    console.info( data('headers'), ':', req.headers );
  }
  if( Object.keys(req.query).length ){
    console.info( data('query'), ':', req.query );
  }
  if( Object.keys(req.body).length ){
    console.info( data('body'), ':', req.body );
  }
  if( Object.keys(res.getHeaders()).length ){
    console.info( data('Response headers'), ':', res.getHeaders() );
  }
  next();
}
