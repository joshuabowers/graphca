import React, { useMemo, CSSProperties } from "react";
import styles from './KeyGroup.module.css'

export interface KeyGroupProps {
  layout?: 'square' | 'horizontal' | 'vertical'
  children?: JSX.Element | JSX.Element[]
}

export interface KeyGroupCSSProps extends CSSProperties {
  '--sideLength': number;
}

const isArray = (x: JSX.Element | JSX.Element[] | unknown): x is JSX.Element[] => {
  return Array.isArray(x)
}

export const KeyGroup = (props: KeyGroupProps) => {
  const sideLength = useMemo(
    () => Math.ceil(Math.sqrt(isArray(props.children) ? props.children.length : 1)), 
    [props.children]
  )
  const appliedStyles = [
    styles.keyGroup,
    styles[props.layout || 'square']
  ];
  return (
    <div 
      className={appliedStyles.join(' ')} 
      style={{'--sideLength': sideLength} as KeyGroupCSSProps}>
      {props.children}
    </div>
  )
}