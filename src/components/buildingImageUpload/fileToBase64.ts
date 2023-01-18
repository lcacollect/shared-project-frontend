export const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.replace(/^data:.+;base64,/, ''))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
