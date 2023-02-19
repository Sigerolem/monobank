import styles from './Players.module.scss'

interface PlayersProps {
  balance: number[]
  names: string[]
}

export function Players({ balance, names }: PlayersProps) {
  function formatBalance(balance: number) {
    if (balance > 999) {
      return (balance / 1000).toFixed(2) + 'M'
    }
    return balance + 'K'
  }
  return (
    <div className={styles.container}>
      {balance.map((value, index) => (
        <div>
          <span>receber</span>
          <h3>{names[index]}</h3>
          <h3>{formatBalance(value)}</h3>
          <span>pagar</span>
        </div>
      ))}
    </div>
  )
}