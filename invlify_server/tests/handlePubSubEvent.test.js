require('dotenv').config()

const axios = require('axios')
const { handlePubSubEvent } = require('../handlers/gmailPubSubListener')
const { addOrderToUser } = require('../handlers/firestoreFunctions')

const { FULL_CUSTOMER_LIST, FULL_PRODUCT_LIST } = require('./mockData')

jest.mock('googleapis')
jest.mock('axios')
jest.mock('../handlers/firestoreFunctions', () => ({
  ...jest.requireActual('../handlers/firestoreFunctions'),
  addOrderToUser: jest.fn(),
}))

describe('handlePubSubEvent', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('Normal parsing flow', async () => {
    // API response mocks.
    const mockedHistoryResponse = {
      data: {
        history: [
          {
            id: '1',
            messages: [
              {
                id: '123',
                threadId: '123',
              },
            ],
            messagesAdded: [
              {
                message: {
                  id: '123',
                  threadId: '123',
                  labelIds: ['UNREAD', 'IMPORTANT', 'CATEGORY_FORUMS', 'INBOX'],
                },
              },
            ],
          },
        ],
      },
    }
    const mockedMessageResponse = {
      data: {
        id: '123',
        threadId: '123',
        labelIds: ['IMPORTANT', 'CATEGORY_FORUMS', 'INBOX'],
        snippet:
          'Confirmed On Mon, Aug 7, 2023 at 1:08 AM Latrell Garnett &lt;latrell@consciousplates.com&gt; wrote: Hey guys, Can we get 2 boxes of Oyster Mushrooms delivered on Monday 8/7? Gratitude, Latrell --',
        payload: {
          partId: '',
          mimeType: 'multipart/alternative',
          filename: '',
          headers: [
            {
              name: 'From',
              value: 'Latrell Garnett <Latrell@consciousplates.com>',
            },
            {
              name: 'Date',
              value: 'Mon, 7 Aug 2023 20:51:14 -0500',
            },
            {
              name: 'Subject',
              value: 'Re: Order for Monday 8/7',
            },
          ],
          body: {
            size: 0,
          },
          parts: [
            {
              partId: '0',
              mimeType: 'text/plain',
              filename: '',
              headers: [
                {
                  name: 'Content-Type',
                  value: 'text/plain; charset="UTF-8"',
                },
              ],
              body: {
                size: 602,
                data: 'Q29uZmlybWVkDQoNCk9uIE1vbiwgQXVnIDcsIDIwMjMgYXQgMTowOCBBTSBMYXRyZWxsIEdhcm5ldHQgPGxhdHJlbGxAY29uc2Npb3VzcGxhdGVzLmNvbT4NCndyb3RlOg0KDQo-IEhleSBndXlzLA0KPg0KPiBDYW4gd2UgZ2V0IDIgYm94ZXMgb2YgT3lzdGVyIE11c2hyb29tcyBkZWxpdmVyZWQgb24gTW9uZGF5IDgvNz8NCj4NCj4gR3JhdGl0dWRlLA0KPiBMYXRyZWxsDQo-IC0tDQo-IExhdHJlbGwgR2FybmV0dCAtIFZpc2lvbmFyeQ0KPiBSZXN0YXVyYW50OiAzMTIuMzc0LjYzMjcNCj4gRGlyZWN0OiAzMTIuMzk1LjA3MDENCj4gd3d3LmNvbnNjaW91c3BsYXRlcy5jb20NCj4NCi0tIA0KSm9obiBKYW1lcw0KQ28tT3duZXIvTXljb2xvZ2lzdA0KDQotLSANCllvdSByZWNlaXZlZCB0aGlzIG1lc3NhZ2UgYmVjYXVzZSB5b3UgYXJlIHN1YnNjcmliZWQgdG8gdGhlIEdvb2dsZSBHcm91cHMgIldpbmR5IENpdHkgU2FsZXMiIGdyb3VwLg0KVG8gdW5zdWJzY3JpYmUgZnJvbSB0aGlzIGdyb3VwIGFuZCBzdG9wIHJlY2VpdmluZyBlbWFpbHMgZnJvbSBpdCwgc2VuZCBhbiBlbWFpbCB0byBzYWxlcyt1bnN1YnNjcmliZUB3aW5keWNpdHltdXNocm9vbS5jb20uDQo=',
              },
            },
          ],
        },
      },
    }

    // Test flow.
    axios.request.mockResolvedValueOnce(mockedHistoryResponse)
    axios.request.mockResolvedValueOnce(mockedMessageResponse)

    await handlePubSubEvent('', '', {
      uid: '123',
      customers: FULL_CUSTOMER_LIST,
      products: FULL_PRODUCT_LIST,
    })

    expect(addOrderToUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      '92',
      [{ product: '20', quantity: 12 }],
      expect.anything(),
      expect.anything()
    )
  })
})
