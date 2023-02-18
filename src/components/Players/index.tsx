import styles from './Players.module.scss'

interface PlayersProps {
  players: number[]
}

export function Players({ players }: PlayersProps) {
  return (
    <div className={styles.container}>
      {players.map(value => (
        <h2>{(value / 1000).toFixed(3)}</h2>
      ))}
    </div>
  )
}