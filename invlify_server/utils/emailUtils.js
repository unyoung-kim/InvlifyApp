const decodeBase64IntoUTF8 = (base64EncodedMessage) => {
  return Buffer.from(base64EncodedMessage, 'base64').toString('utf-8')
}

/**
 * Recursive function to process "parts" field of message to find a "text/plain"
 * part.
 */
const processMessageParts = (parts) => {
  if (!!parts) {
    const multipartRegex = /^multipart/

    for (const part of parts) {
      if (multipartRegex.test(part.mimeType)) {
        const processedMultipart = processMessageParts(part.parts)
        if (!!processedMultipart) {
          return processedMultipart
        }
      } else if (part.mimeType === 'text/plain') {
        const { data: emailContentInBase64 } = part.body

        return decodeBase64IntoUTF8(emailContentInBase64)
      }
    }
  }

  return ''
}

module.exports = {
  decodeBase64IntoUTF8,
  processMessageParts,
}
