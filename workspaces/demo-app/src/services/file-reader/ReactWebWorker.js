class ReactWebWorker {
  static createFromScript (script) {
    let code = script.toString()
    code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

    const blob = new Blob([code], { type: 'application/javascript' })

    const workerScript = URL.createObjectURL(blob)

    return new Worker(workerScript)
  }
}

export { ReactWebWorker }
