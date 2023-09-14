require('dotenv').config()

const { ParseCustomerName } = require('../utils/chatGPT')
const { SHORT_CUSTOMER_LIST, FULL_CUSTOMER_LIST } = require('./mockData')

const getCustomerNameFromList = (list, id) => list[id]?.name

describe('Get Customer ID', () => {
  describe('Short Customer List', () => {
    describe('Easy', () => {
      test('Easy 1', async () => {
        const email = {
          title: 'Order from Planta Queen',
          sender: 'Soh Je Yeong <sohjeyeong@gmail.com>',
          date: '2023-07-25',
          message:
            'Hello, can we please order for Planta Queen:\r\n\r\n6# oyster mushroom mix\r\n\r\nThank you\r\n',
        }

        const expectedCustomerId = '1'
        const expectedCustomerName = getCustomerNameFromList(
          SHORT_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(SHORT_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Easy 2', async () => {
        const email = {
          title: 'Order from Planta Queen',
          sender: 'Soh Je Yeong <sohjeyeong@gmail.com>',
          date: '2023-07-25',
          message:
            'Hello, can we please order:\r\n\r\n6# oyster mushroom mix\r\n\r\nThank you\r\n',
        }

        const expectedCustomerId = '1'
        const expectedCustomerName = getCustomerNameFromList(
          SHORT_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(SHORT_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })
    })

    describe('Hard', () => {
      test('Hard 1 - Name hidden in email address', async () => {
        const email = {
          title: 'Order',
          sender: 'Mercado, Yammi <Yammi.Mercado@chicagoathletichotel.com>',
          date: '2023-07-25',
          message:
            'Can we plz order 1 cs oyster mushroom\r\nPlz deliver to the 8th floor\r\n\r\nThanks\r\n',
        }

        const expectedCustomerId = '2'
        const expectedCustomerName = getCustomerNameFromList(
          SHORT_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(SHORT_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })
    })
  })

  describe('Full Customer List', () => {
    describe('Easy', () => {
      test('Easy 1', async () => {
        const email = {
          title: 'Apolonia order',
          sender: 'Joseph Spretnjak <jws@apoloniachicago.com>',
          date: '2023-07-25',
          message:
            'Hello, can we please order:\r\n\r\n6# oyster mushroom mix\r\n\r\nThank you\r\n',
        }

        const expectedCustomerId = '68'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Easy 2', async () => {
        const email = {
          title: 'etta bucktown',
          sender: 'Eric Wilson <e.wilson@ettacollective.com>',
          date: '2023-07-19',
          message: 'for tomorrow please:\r\n\r\n6 cs oyster mushrooms\r\n',
        }

        const expectedCustomerId = '108'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })
    })

    describe('Medium', () => {
      test('Medium 1 - Multiple similar names in list', async () => {
        const email = {
          title: 'RPM Steak Order for Tomorrow 7/20',
          sender: 'Aubrey Oko <aoko@lettuce.com>',
          date: '2023-07-19',
          message: '60# maitake mushrooms please\r\n',
        }

        const expectedCustomerId = '159'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Medium 2 - Multiple similar names in list', async () => {
        const email = {
          title: 'windy city for the publican',
          sender: 'Joe Spain <joespain@thepublicanrestaurant.com>',
          date: '2023-07-24',
          message: 'order in please\r\n3 cs oyster mushrooms\r\nthanks\r\n\r\n',
        }

        const expectedCustomerId = '150'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Medium 3 - Shortened name, personal email', async () => {
        const email = {
          title: 'Bloom',
          sender: 'javier alejandro <japc1910@gmail.com>',
          date: '2023-07-24',
          message:
            'Helooo !!!\r\nCan I ordr please\r\n\r\n2 cs maitaki\r\n4 cs oyster\r\n\r\nthanks!!!\r\n',
        }

        const expectedCustomerId = '82'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Medium 4 - Shortened name, name hidden in the email', async () => {
        const email = {
          title: 'DDG Order',
          sender: 'Tyler Chin <tchin@duckduckgoatchicago.com>',
          date: '2023-07-24',
          message: `Hello can we please have,

            3 cs oyster mushroom mix 
            
            Thank you,
            Tyler Chin
            
            Get Outlook for iOS
            --
            You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
            To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com.`,
        }

        const expectedCustomerId = '99'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })
    })

    describe('Hard', () => {
      test('Hard 1 - Name hidden in email address', async () => {
        const email = {
          title: 'Order',
          sender: 'Mercado, Yammi <Yammi.Mercado@chicagoathletichotel.com>',
          date: '2023-07-25',
          message:
            'Can we plz order 1 cs oyster mushroom\r\nPlz deliver to the 8th floor\r\n\r\nThanks\r\n',
        }

        const expectedCustomerId = '87'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })

      test('Hard 2 - Name hidden in email address', async () => {
        const email = {
          title: 'Thursday',
          sender: 'Joe Fasolo <jaf@valhallachicago.com>',
          date: '2023-07-19',
          message:
            'Hello can i order for tomorrow:\r\n\r\n\r\n-10# maitake mushroom\r\n\r\nThank you\r\n',
        }

        const expectedCustomerId = '177'
        const expectedCustomerName = getCustomerNameFromList(
          FULL_CUSTOMER_LIST,
          expectedCustomerId
        )

        const customerName = await ParseCustomerName(FULL_CUSTOMER_LIST, email)

        expect(customerName).toBe(expectedCustomerName)
      })
    })
  })
})
