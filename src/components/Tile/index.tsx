import { useRef } from 'react'
import styles from './Tile.module.scss'

interface TileProps {
  value: string
  display?: string
  type: string
  onClicks: (value: string, type: string) => void
  onLongPress?: () => void
}

export function Tile({ value, display, type, onClicks, onLongPress }: TileProps) {
  if (display === undefined) display = value
  const longPressTimer = useRef<number>()


  if (onLongPress !== undefined) {
    return (
      <button
        onTouchStart={() => {
          longPressTimer.current = setTimeout(() => {
            onLongPress()
          }, 600);
        }}
        onTouchEnd={() => { clearTimeout(longPressTimer.current) }}
        onAuxClick={() => { onLongPress() }}
        onClick={() => { onClicks(value, type) }}
        className={styles.container} >
        <h2>{display}</h2>
      </button>
    )
  } else {
    return (
      <button onClick={() => { onClicks(value, type) }} className={styles.container} >
        <h2>{display}</h2>
      </button>
    )
  }


}