const ExampleWorkerScript = () => {
  self.onmessage = m => {
    self.postMessage(m.data * 2)
  }
}

export { ExampleWorkerScript }
