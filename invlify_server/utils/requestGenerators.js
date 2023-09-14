const generateGoogleRequestForAxios = (url, accessToken) => {
  return {
    method: 'get',
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      'Content-type': 'application/json',
    },
  }
}

const generateGmailWatchRequestForAxios = (url, accessToken) => {
  return {
    method: 'post',
    url: url,
    headers: {
      Authorization: `Bearer ${accessToken} `,
      'Content-type': 'application/json',
    },
  }
}

module.exports = {
  generateGoogleRequestForAxios,
  generateGmailWatchRequestForAxios,
}
