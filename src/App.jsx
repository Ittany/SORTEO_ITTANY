import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { RaffleProvider } from './contexts/RaffleContext'
import { ToastProvider } from './contexts/ToastContext'
import Header from './components/Header'
import BallForm from './components/BallForm'
import BallList from './components/BallList'
import RouletteWheel from './components/RouletteWheel'
import DrawPanel from './components/DrawPanel'
import WinnersPanel from './components/WinnersPanel'
import StatsPanel from './components/StatsPanel'
import ToastHost from './components/ToastHost'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  const [view, setView] = useState('game')

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RaffleProvider>
          <ToastProvider>
            <div className="game">
              <Header
                view={view}
                onStart={() => setView('game')}
                onHome={() => setView('game')}
              />

              <main className="game__grid">
                <div className="col">
             <h1> RUL-ITTANY</h1>

                  <BallForm />
                  <BallList />
                </div>

                <div className="col">
                  <RouletteWheel />
                  <DrawPanel />
                </div>

                <div className="col">
                  <WinnersPanel />
                  <StatsPanel />
                </div>
              </main>

              <ToastHost />
            </div>
          </ToastProvider>
        </RaffleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}