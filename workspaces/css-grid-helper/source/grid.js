export class Grid {
  constructor (grid, modifiers) {
    this.grid = grid
    this.modifiers = modifiers
    this.defaultContainerStyles = {
      display: 'grid',
      gridGap: '5px',
      gridTemplateAreas: this.getGridTemplateAreas(),
      gridTemplateColumns: this.getGridTemplateColumns(),
      gridTemplateRows: this.getGridTemplateRows()
    }
    Object.assign(this, {
      container: {
        ...this.defaultContainerStyles,
        ...this.modifiers
      }
    })

    this.createGridAreas()
  }

  getGridTemplateAreas () {
    return this.grid.reduce((acc, value) => {
      return `${acc} "${value}"`
    }, '')
  }

  getGridTemplateColumns () {
    const columns = Math.max(...this.grid.map(e => e.split(/\s+/).length))
    return [...Array(columns).keys()].map(() => '1fr').join(' ')
  }

  getGridTemplateRows () {
    return this.grid.map(() => '1fr').join(' ')
  }

  applyToStyles (styles) {
    const gridAreas = new Set(this.grid.join(' ').split(/\s+/))
    const gridElements = [...gridAreas].reduce((acc, value) => {
      acc[value] = { gridArea: value }
      return acc
    }, {})

    return {
      ...styles,
      container: { ...this.defaultContainerStyles, ...this.modifiers },
      ...gridElements
    }
  }

  getGridContainerStyle () {
    return { ...this.defaultContainerStyles, ...this.modifiers }
  }

  createGridAreas () {
    const gridAreas = new Set(this.grid.join(' ').split(/\s+/))
    const gridElements = [...gridAreas].reduce((acc, value) => {
      acc[value] = { gridArea: value }
      return acc
    }, {})
    Object.assign(this, gridElements)
  }
}
