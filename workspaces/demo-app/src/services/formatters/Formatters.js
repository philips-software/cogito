class Formatters {
  static formatMoney (amount) {
    const toFixed = amount.toFixed(2)
    return '$' + toFixed.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  }

  static formatDate (timestamp) {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      minute: '2-digit',
      hour: '2-digit'
    })
  }
}

export { Formatters }
