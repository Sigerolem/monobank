import styles from './Display.module.scss'

interface DisplayProps {
  value: string;
}

export function Display({ value }: DisplayProps) {
  return (
    <div className={styles.container}>
      <h2>{value}</h2>
    </div>
  )
}