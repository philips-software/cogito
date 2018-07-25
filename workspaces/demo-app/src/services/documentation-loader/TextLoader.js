class TextLoader {
  static fromFile = async path => {
    const response = await fetch(path)
    return response.text()
  }
}

export { TextLoader }
