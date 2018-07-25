class TextLoader {
  static fromFile = async path => {
    const response = await fetch('documentation/stream-encryption.md')
    return response.text()
  }
}

export { TextLoader }
