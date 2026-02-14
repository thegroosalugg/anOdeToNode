// use negative hues for b/w bg: -1 black ... -100 white
const getStyles = (hue: number) => {
  const isGrey = hue < 0
  const h = isGrey ? 0 : hue % 360
  const s = isGrey ? 0 : 50
  const l = isGrey ? Math.min(Math.abs(hue), 100) : 50

  const color = isGrey && l > 50 ? 'black' : 'white'
  const background = `hsl(${h}, ${s}%, ${l}%)`
  return `color: ${color}; background: ${background}; padding: 2px 4px;`
}

let minute, second
const hour = minute = second = '2-digit' as const

const getTime = () => new Date().toLocaleTimeString([], { hour, minute, second, hour12: false })

const getRootComponent = () => {
  const stack = new Error().stack?.split('\n') || []

  return (
    stack
      .map((line) => line.match(/\/([^/]+)\.tsx?/i)?.[1]) // Extract file names
      .filter(Boolean) // Remove null values
      .pop() || ''
  ) // Get the earliest component in the stack
}

export function captainsLog(hue: number, items: Record<string, unknown>) {
  const style = getStyles(hue)
  console.log(`\n%c${getRootComponent()} ${getTime()}`, style)

  Object.entries(items).forEach(([key, value]) => {
    const message  = `  %c${key}:::`
    const isObject = typeof value === 'object' && value !== null
    if (isObject) {
      console.log(message, style)
      console.dir(value)
    } else {
      console.log(`${message} ${value}`, style)
    }
  })
}
