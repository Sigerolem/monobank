import { useEffect, useRef, useState } from 'react'
import styles from './App.module.scss'
import { Display } from './components/Display'
import { Tile } from './components/Tile'

type PlayerState = 'unselected' | 'payer' | 'receiver'

const INITIAL_PLAYERS_STATE = [{ state: 'unselected' }, { state: 'unselected' }, { state: 'unselected' }, { state: 'unselected' }, { state: 'unselected' }, { state: 'unselected' }]
const INITIAL_PLAYERS_BALANCE = [15000, 15000, 15000, 15000, 15000, 15000]
const INITIAL_PLAYERS_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6']

function App() {
  const [display, setDisplay] = useState('0')
  const [playersBalance, setPlayersBalance] = useState(INITIAL_PLAYERS_BALANCE as number[])
  const [playersNames, setplayersNames] = useState(INITIAL_PLAYERS_NAMES as string[])
  const [selected, setSelected] = useState(INITIAL_PLAYERS_STATE as { state: PlayerState }[])
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      let savedBalance = localStorage.getItem('monobank_balance')
      let savedNames = localStorage.getItem('monobank_names')
      if (savedBalance !== null && savedNames !== null) {
        setPlayersBalance(JSON.parse(savedBalance))
        setplayersNames(JSON.parse(savedNames))
      }
      firstRender.current = false
      return
    } else {
      localStorage.setItem('monobank_balance', JSON.stringify(playersBalance))
      localStorage.setItem('monobank_names', JSON.stringify(playersNames))
    }

  }, [playersBalance, playersNames])

  function handleKeyPress(value: string, type: string) {
    if (type === 'command') {
      handleCommandPress(value)
    } else if (type === 'number') {
      handleNumberPress(value)
    }
  }

  function handleNumberPress(value: string) {
    navigator.vibrate(50)
    if (display.length > 7) { return }
    if (display.includes('.') && value === '.') { return }

    if (display === '0' && value !== '.') {
      setDisplay(value)
      return
    }

    setDisplay(prev => (prev + value))
  }

  function handleCommandPress(value: string) {
    navigator.vibrate(150)

    if ((display === '0' || parseFloat(display) == 0) && value !== 'C' && value !== 'V') {
      return
    }

    if (value === 'C') {
      setDisplay('0')
      return
    }

    if (value === 'V') {
      handleTurnCompletion()
      return
    }

    if (value === 'K' && (display.includes('.') || parseFloat(display) < 10)) {
      alert('Valor invalido para essa transação')
      setDisplay('0')
      return
    }

    handleTransaction(value)

    setSelected(INITIAL_PLAYERS_STATE as { state: PlayerState }[])
    setDisplay('0')
  }

  function handleTurnCompletion() {
    let receivers = [] as number[]
    let payers = [] as number[]
    selected.forEach((player, index) => {
      if (player.state === 'receiver') {
        receivers.push(index)
      } else if (player.state === 'payer') {
        payers.push(index)
      }
    })
    if (payers.length > 0) {
      alert('Para que seja pago o valor pela volta completada, selecione apenas os jogadores que devem receber.')
      setSelected(INITIAL_PLAYERS_STATE as { state: PlayerState }[])
      setDisplay('0')
      return
    }
    setPlayersBalance(prev => prev.map((player, index) => (
      receivers.includes(index) ? player + 2000 : player
    )))
    setSelected(INITIAL_PLAYERS_STATE as { state: PlayerState }[])
    setDisplay('0')
  }

  function handleTransaction(multiplier: string) {
    let transactionAmount = multiplier === 'K' ? parseInt(display) : parseFloat(display) * 1000
    let payers = [] as number[]
    let receivers = [] as number[]
    selected.forEach((player, index) => {
      if (player.state === 'receiver') {
        receivers.push(index)
      } else if (player.state === 'payer') {
        payers.push(index)
      }
    })

    if (payers.length > 1 && receivers.length > 1) {
      alert('As operações não podem ter multiplos pagadores e multiplos recebedores simultaneamente.')
      setSelected(INITIAL_PLAYERS_STATE as { state: PlayerState }[])
      return
    }

    if (payers.length === 1) {
      if (receivers.length === 0) {
        setPlayersBalance(prev => prev.map((value, index) => (
          payers.includes(index) ? value - transactionAmount : value
        )))
      } else if (receivers.length === 1) {
        setPlayersBalance(prev => prev.map((value, index) => (
          payers.includes(index)
            ? value - transactionAmount : receivers.includes(index)
              ? value + transactionAmount : value
        )))
      } else {
        setPlayersBalance(prev => prev.map((value, index) => (
          payers.includes(index)
            ? value - transactionAmount * receivers.length : receivers.includes(index)
              ? value + transactionAmount : value
        )))
      }
      return
    }

    if (receivers.length === 1) {
      if (payers.length === 0) {
        setPlayersBalance(prev => prev.map((value, index) => (
          receivers.includes(index) ? value + transactionAmount : value
        )))
      } else if (payers.length === 1) {
        setPlayersBalance(prev => prev.map((value, index) => (
          receivers.includes(index)
            ? value + transactionAmount : payers.includes(index)
              ? value - transactionAmount : value
        )))
      } else {
        setPlayersBalance(prev => prev.map((value, index) => (
          receivers.includes(index)
            ? value + transactionAmount * payers.length : payers.includes(index)
              ? value - transactionAmount : value
        )))
      }
      return
    }

    if (receivers.length > 1 && payers.length === 0) {
      setPlayersBalance(prev => prev.map((value, index) => (
        receivers.includes(index) ? value + transactionAmount : value
      )))
      return
    }

    if (payers.length > 1 && receivers.length === 0) {
      setPlayersBalance(prev => prev.map((value, index) => (
        payers.includes(index) ? value - transactionAmount : value
      )))
    }

  }

  function handleSelection(player: number) {
    let newState = 'unselected' as PlayerState

    if (selected[player].state === 'unselected') {
      newState = 'receiver'
    } else if (selected[player].state === 'receiver') {
      newState = 'payer'
    }

    setSelected(prev => prev.map((obj, index) => {
      if (index === player) {
        return { state: newState }
      }
      return { state: obj.state }
    }))

  }

  function formatBalance(balance: number) {
    if (balance > 999) {
      return (balance / 1000).toFixed(2) + 'M'
    }
    if (balance < 999) {
      return (balance / 1000).toFixed(2) + 'M'
    }
    return balance + 'K'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Monobank</h1>
      </div>
      {/* <Keypad /> */}

      {/* <Players balance={playersBalance} names={playersNames} /> */}


      <div className={styles.selection} >
        {playersBalance.map((_, index) => (
          <button key={index}
            onClick={() => { handleSelection(index) }}
            className={
              selected[index].state === 'payer'
                ? styles.payer : selected[index].state === 'receiver'
                  ? styles.receiver : ''
            }
          >
            <h3>{playersNames[index]}</h3>
            <h3>{formatBalance(playersBalance[index])}</h3>
          </button>
        ))}
      </div>

      <Display value={display} />

      <div className={styles.keypad}>
        <Tile onClicks={handleKeyPress} value='K' type='command' />
        <Tile onClicks={handleKeyPress} value='V' type='command' />
        <Tile onClicks={handleKeyPress} value='M' type='command' />
        <Tile onClicks={handleKeyPress} value='1' type='number' />
        <Tile onClicks={handleKeyPress} value='2' type='number' />
        <Tile onClicks={handleKeyPress} value='3' type='number' />
        <Tile onClicks={handleKeyPress} value='4' type='number' />
        <Tile onClicks={handleKeyPress} value='5' type='number' />
        <Tile onClicks={handleKeyPress} value='6' type='number' />
        <Tile onClicks={handleKeyPress} value='7' type='number' />
        <Tile onClicks={handleKeyPress} value='8' type='number' />
        <Tile onClicks={handleKeyPress} value='9' type='number' />
        <Tile onClicks={handleKeyPress} value='C' type='command' />
        <Tile onClicks={handleKeyPress} value='0' type='number' />
        <Tile onClicks={handleKeyPress} value='.' type='number' />
      </div>
    </div>
  )
}

export default App
