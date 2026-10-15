import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.info = info
    // Aquí podrías enviar el error a un servicio de monitoreo
    console.error('[ErrorBoundary]', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
    // Recarga la página para limpiar el estado que causó el error
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="crash">
          <div className="crash__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <h1 className="crash__title">Algo se rompió en el sorteo</h1>
          <pre className="crash__msg">
            {String(this.state.error?.message ?? this.state.error)}
          </pre>
          <button className="btn btn--primary" onClick={this.handleReset} type="button">
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}