const actualAxios = jest.requireActual('axios')

module.exports = {
  ...actualAxios,
  request: jest.fn(actualAxios.request),
}
