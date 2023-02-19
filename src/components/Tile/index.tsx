import styles from './Tile.module.scss'

interface TileProps {
  value: string
  display?: string
  type: string
  onClicks: (value: string, type: string) => void
}

export function Tile({ value, display, type, onClicks }: TileProps) {
  if (display === undefined) display = value

  return (
    <button onClick={() => { onClicks(value, type) }} className={styles.container} >
      <h2>{display}</h2>
    </button>
  )
}