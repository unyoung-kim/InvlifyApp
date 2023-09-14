require('dotenv').config()

const { parseEmail } = require('../handlers/gmailPubSubListener')
const { FULL_PRODUCT_LIST } = require('./mockData')

const _parseEmailAndCheckExpected = async (
  email,
  { expectedLines, expectedDeliveryDate } = {},
  shouldBeOrder = true
) => {
  const [isOrder, lines, deliveryDate] = await parseEmail(
    email,
    FULL_PRODUCT_LIST
  )

  const parsedLines = JSON.parse(lines)

  if (shouldBeOrder) {
    expect(isOrder).toBe('yes')
    expect(parsedLines).toEqual(expectedLines)
    expect(deliveryDate).toBe(expectedDeliveryDate)
  } else {
    expect(isOrder).not.toBe('yes')
  }
}

describe('Email Parsing Accuracy', () => {
  describe('Orders', () => {
    describe('Easy', () => {
      test('Easy 1', async () => {
        const email = {
          title: 'Apolonia order',
          sender: 'Joseph Spretnjak <jws@apoloniachicago.com>',
          date: '2023-07-22',
          message:
            'Hello, for Monday can we please order:\r\n\r\n6# oyster mushroom mix\r\n\r\nThank you\r\n',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 6 }]
        const expectedDeliveryDate = '2023-07-24'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 2', async () => {
        const email = {
          title: 'RPM Steak Order for Tomorrow 7/20',
          sender: 'Aubrey Oko <aoko@lettuce.com>',
          date: '2023-07-19',
          message: '60# maitake mushrooms please\r\n',
        }

        const expectedLines = [{ product: 'Maitake', quantity: 60 }]
        const expectedDeliveryDate = '2023-07-20'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 3', async () => {
        const email = {
          title: 'etta bucktown',
          sender: 'Eric Wilson <e.wilson@ettacollective.com>',
          date: '2023-07-19',
          message: 'for tomorrow please:\r\n\r\n6 cs oyster mushrooms\r\n',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 36 }]
        const expectedDeliveryDate = '2023-07-20'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 4', async () => {
        const email = {
          title: 'Thursday',
          sender: 'Joe Fasolo <jaf@valhallachicago.com>',
          date: '2023-07-19',
          message:
            'Hello can i order for tomorrow:\r\n\r\n\r\n-10# maitake mushroom\r\n\r\nThank you\r\n',
        }

        const expectedLines = [{ product: 'Maitake', quantity: 10 }]
        const expectedDeliveryDate = '2023-07-20'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 5', async () => {
        const email = {
          title: 'windy city for the publican',
          sender: 'Joe Spain <joespain@thepublicanrestaurant.com>',
          date: '2023-07-24',
          message: 'order in please\r\n3 cs oyster mushrooms\r\nthanks\r\n\r\n',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 18 }]
        const expectedDeliveryDate = '2023-07-25'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 6', async () => {
        const email = {
          title: 'Etta River North Thursday',
          sender: 'Ryan Piotrowski <r.piotrowski@ettacollective.com>',
          date: '2023-08-01',
          message:
            'Good afternoon,\r\nFor Thursday we need:\r\n40# mix mushrooms\r\n\r\nThanks so much,\r\nRyan',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 40 }]
        const expectedDeliveryDate = '2023-08-03'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 7', async () => {
        const email = {
          title: 'order',
          sender: 'Latrell Garnett <latrell@consciousplates.com>',
          date: '2023-08-01',
          message:
            'Hey guys,\r\nCan we get 2 boxes of Oyster Mushrooms delivered tomorrow?\r\n\r\nGratitude,',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 12 }]
        const expectedDeliveryDate = '2023-08-02'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 8  - Added `-- You received this message..`', async () => {
        const email = {
          title: 'WCM for Open Produce 8/1',
          sender: 'Riley Leitch <buyers@openproduce.org>',
          date: '2023-08-01',
          message: `Hello,\r\n\r\nCould we get the following delivered to Open Produce this week?\r\n\r\n1 x 6 lb box lions mane\r\n1 x 6 lb box oyster\r\n\r\nThanks\r\nRiley Leitch (he/him)\r\nOpen Produce Inventory/r/n
            --
          You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
          To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com.`,
        }

        const expectedLines = [
          { product: 'Lions Mane/Combs Tooth', quantity: 6 },
          { product: 'Mixed Oysters', quantity: 6 },
        ]
        const expectedDeliveryDate = '2023-08-02'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 9 - Added `-- You received this message..`', async () => {
        const email = {
          title: 'Planta Queen for tomorrow',
          sender: 'Kelsey Knowles <kelsey.k@plantahq.com>',
          date: '2023-08-02',
          message: `3 cs oyster mushrooms
          --
          You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
          To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com.`,
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 18 }]
        const expectedDeliveryDate = '2023-08-03'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 10 - Added `-- You received this message..`', async () => {
        const email = {
          title: 'Windy Publican',
          sender: 'Paul Oh <paul@thepublicanrestaurant.com>',
          date: '2023-10-01',
          message: `#50 Maitke 3 cases Oyster
          --
          You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
          To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com.`,
        }

        const expectedLines = [
          { product: 'Maitake', quantity: 50 },
          { product: 'Mixed Oysters', quantity: 18 },
        ]
        const expectedDeliveryDate = '2023-10-02'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Easy 11 - Added `-- You received this message..`', async () => {
        const email = {
          title: 'Ddg orders',
          sender: 'Tyler Chin <tchin@duckduckgoatchicago.com>',
          date: '2023-08-13',
          message: `Hello can we please have,

          3 cs oyster mushroom mix 
          
          Thank you,
          Tyler Chin
          
          Get Outlook for iOS
          --
          You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
          To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com.`,
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 18 }]
        const expectedDeliveryDate = '2023-08-14'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })
    })

    describe('Medium', () => {
      test('Medium 1', async () => {
        const email = {
          title: 'Maple&Ash delivery 7/21',
          sender: 'Antonio Nunez <anunez@mapleandash.com>',
          date: '2023-07-19',
          message: '36# oyster\r\na case of gourmet\r\n\r\nThank you,\r\n',
        }

        const expectedLines = [
          { product: 'Mixed Oysters', quantity: 36 },
          { product: 'Gourmet Blend', quantity: 6 },
        ]
        const expectedDeliveryDate = '2023-07-21'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      // test('Medium 2 - Product not on list', async () => {
      //   const email = {
      //     title: 'Order 7/21',
      //     sender: 'Antonio Nunez <anunez@mapleandash.com>',
      //     date: '2023-07-19',
      //     message: 'Order: 36# magic\r\n\r\nThank you,\r\n',
      //   }

      //   const expectedLines = []
      //   const expectedDeliveryDate = '2023-07-21'

      //   await _parseEmailAndCheckExpected(email, {
      //     expectedLines,
      //     expectedDeliveryDate,
      //   })
      // })

      test('Medium 3 - Requesting for same day delivery', async () => {
        const email = {
          title: 'Possible delivery today?',
          sender: 'Latrell Garnett <latrell@consciousplates.com>',
          date: '2023-07-29',
          message:
            'Hey guys!\r\n My apologies for this last minute request, is it possible to get 2 boxes of oysters delivered today?\r\n\r\nGratitude,\r\nLatrell',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 12 }]
        const expectedDeliveryDate = '2023-07-29'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })

      test('Medium 4 - Order with additional message', async () => {
        const email = {
          title: 'Bloom',
          sender: 'javier alejandro <japc1910@gmail.com>',
          date: '2023-08-01',
          message:
            'Hi! How are you today?\r\nI would like to order 3 cs of oysters but my last order I didn’t receive a good quality of the mushroom, the most of them were with a lot of humidity and I have to throw them away.  That is something unusual, but I just I want to let you know. \r\n\r\nThanks like always ',
        }

        const expectedLines = [{ product: 'Mixed Oysters', quantity: 18 }]
        const expectedDeliveryDate = '2023-08-02'

        await _parseEmailAndCheckExpected(email, {
          expectedLines,
          expectedDeliveryDate,
        })
      })
    })

    describe('Hard', () => {
      // test('Hard 1', async () => {
      //   const email = {
      //     title: 'Sugar Beet 7/25',
      //     sender: 'Olive Hartman <produce@sugarbeet.coop>',
      //     date: '2023-07-25',
      //     message:
      //       "Hey there!\r\n\r\nHope y'all are surviving this heat wave!\r\n\r\nMight we be able to request a case of:\r\n\r\n- Lion's Mane\r\n- And a case of either Black Pearls, or of Chestnuts. We only have the other mushroom space open, so can't take both this week lol\r\n\r\nThank you!!\r\n",
      //   }
      //   const expectedLines = '??'
      //   const expectedDeliveryDate = '2023-07-25'
      //   await _parseEmailAndCheckExpected(email, {
      //     expectedLines,
      //     expectedDeliveryDate,
      //   })
      // })
    })
  })

  describe('Non-Orders', () => {
    test('Non-Order 1', async () => {
      const email = {
        title: 'Help at Warehouse?',
        sender: 'A. D. <aderanick@gmail.com>',
        date: '2023-07-24',
        message:
          'Hello,\r\n\r\nI was at a diy punk show recently, and someone suggested reaching out to you.\r\n\r\nAttached a resume.\r\n',
      }

      await _parseEmailAndCheckExpected(email, undefined, false)
    })

    test('Non-Order 2', async () => {
      const email = {
        title: 'mushroom CSA?',
        sender: 'Gel Pavone <gelpavone@gmail.com>',
        date: '2023-07-22',
        message:
          "Hi!\r\n\r\nI love windy city mushroom and I'm sad you're no longer operating out of Chicago! I'd love to buy my mushrooms directly, if possible. Are you considering any kind of CSA or direct shipping in the future?\r\n\r\nThanks!\r\n",
      }

      await _parseEmailAndCheckExpected(email, undefined, false)
    })
  })
})
