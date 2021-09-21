import React from "react";
import styles from './KeyGroup.module.css'

export interface KeyGroupProps {
  layout?: 'full' | 'horizontal' | 'vertical'
  children?: JSX.Element | JSX.Element[]
}

export const KeyGroup = (props: KeyGroupProps) => {
  const appliedStyles = [
    styles.keyGroup,
    styles[props.layout || 'full']
  ];
  return (
    <div className={appliedStyles.join(' ')}>
      {props.children}
    </div>
  )
}