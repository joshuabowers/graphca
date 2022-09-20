import React, { useMemo, CSSProperties } from "react";
import styles from './KeyGroup.module.css'

export interface KeyGroupProps {
  layout?: 'rectangular' | 'horizontal' | 'vertical'
  columns?: number
  fullWidth?: boolean
  children?: JSX.Element | JSX.Element[]
}

export interface KeyGroupCSSProps extends CSSProperties {
  '--columns': number;
}

const isArray = (x: JSX.Element | JSX.Element[] | unknown): x is JSX.Element[] => {
  return Array.isArray(x)
}

export const KeyGroup = (props: KeyGroupProps) => {
  const columns = useMemo(
    () => props.columns ?? Math.ceil(Math.sqrt(isArray(props.children) ? props.children.length : 1)), 
    [props.columns, props.children]
  )
  const appliedStyles = [
    styles.keyGroup,
    styles[props.layout || 'rectangular']
  ];
  if(props.fullWidth) appliedStyles.push(styles.fullWidth)
  return (
    <div 
      className={appliedStyles.join(' ')} 
      style={{'--columns': columns} as KeyGroupCSSProps}>
      {props.children}
    </div>
  )
}