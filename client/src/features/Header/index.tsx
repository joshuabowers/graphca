import React from 'react';
import styles from './Header.module.css';

export type HeaderProps = {

}

export const Header = (props: HeaderProps) => {
  return (
    <header className={styles.normal}>
      <h1>GraphCa</h1>
      <nav>
        <a href="http://joshuabowers.github.io/graphca" 
          rel="noopener"
          target="_blank"
          className="material-icons">help</a>
      </nav>
    </header>
  )
}
