import styles from './Keypad.module.scss'

import { Tile } from '../Tile'

export function Keypad() {
  return (
    <div className={styles.container}>
      <Tile value='K' type='command' />
      <Tile value='V' type='command' />
      <Tile value='M' type='command' />
      <Tile value='1' type='number' />
      <Tile value='2' type='number' />
      <Tile value='3' type='number' />
      <Tile value='4' type='number' />
      <Tile value='5' type='number' />
      <Tile value='6' type='number' />
      <Tile value='7' type='number' />
      <Tile value='8' type='number' />
      <Tile value='9' type='number' />
      <Tile value=',' type='number' />
      <Tile value='0' type='number' />
      <Tile value='00' type='number' />
    </div>
  )
}