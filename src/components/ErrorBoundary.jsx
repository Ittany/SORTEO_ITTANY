import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Aquí podrías enviar el error a un servicio de monitoreo
    this.info = info
  }

  handleReset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      return (
        <div className="crash">
          <h1>💥 Algo se rompió en el sorteo</h1>
          <pre>{String(this.state.error?.message ?? this.state.error)}</pre>
          <button className="btn btn--primary" onClick={this.handleReset}>
            Reintentar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}