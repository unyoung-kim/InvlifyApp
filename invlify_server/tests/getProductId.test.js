require('dotenv').config()

const { getProductId } = require('../utils/chatGPT')
const { SHORT_PRODUCT_LIST, FULL_PRODUCT_LIST } = require('./mockData')

xdescribe('Get Product ID', () => {
  describe('Short Product List', () => {
    describe('Easy', () => {
      test('Easy 1', async () => {
        const productName = 'Asian Fungitarian'
        const expectedProductId = '1'

        const productId = await getProductId(SHORT_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Easy 2', async () => {
        const productName = 'Combs Tooth'
        const expectedProductId = '5'

        const productId = await getProductId(SHORT_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })
    })

    describe('Medium', () => {
      test('Medium 1 - Shortened name', async () => {
        const productName = 'combs'
        const expectedProductId = '5'

        const productId = await getProductId(SHORT_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })
    })
  })

  describe('Full Product List', () => {
    describe('Easy', () => {
      test('Easy 1', async () => {
        const productName = 'Asian Fungitarian'
        const expectedProductId = '23'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Easy 2', async () => {
        const productName = 'Combs Tooth'
        const expectedProductId = '24'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Easy 3', async () => {
        const productName = 'maitake mushroom'
        const expectedProductId = '22'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })
    })

    describe('Medium', () => {
      test('Medium 1 - Shortened name', async () => {
        const productName = 'combs'
        const expectedProductId = '24'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Medium 2 - Shortened name', async () => {
        const productName = 'gourmet'
        const expectedProductId = '27'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Medium 3 - Partial mismatch', async () => {
        const productName = 'oyster mushrooms'
        const expectedProductId = '5'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })

      test('Medium 4 - Ambiguous', async () => {
        const productName = 'blend'
        const expectedProductId = '27'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })
    })

    describe('Hard', () => {
      test('Hard 1 - Shortened name, misspelled', async () => {
        const productName = 'maitaki'
        const expectedProductId = '22'

        const productId = await getProductId(FULL_PRODUCT_LIST, productName)

        expect(productId).toBe(expectedProductId)
      })
    })
  })
})
