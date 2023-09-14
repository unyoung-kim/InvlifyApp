const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  organization: 'org-zViYeQySG0nY70N4gOT3nDFd',
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

const orderEx1 = {
  title: 'Etta Bucktown',
  sender: 'Soh Je Yeong <sohjeyeong@gmail.com>',
  date: '2023-07-10',
  message:
    'For tomorrow please: 6 cs oyster mushrooms. 4 cs lions mane. thanks!',
}

// 1. Check whether an email is an order
// Input: Email
// Output: "yes" or "no"

const filterOrderEmail = async (email) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You will be given an email object that a food supplier/distributor received, extracted using the gmail API. Your job is to distinguish whether the email is an order email from the customer or not.

        These are sample email orders: 
        <email> {title: "Etta Bucktown", sender: "Soh Je Yeong <sohjeyeong@gmail.com>", date: "2023-07-10", message: "3 cs oyster mushrooms
        --
        You received this message because you are subscribed to the Google Groups "Windy City Sales" group.
        To unsubscribe from this group and stop receiving emails from it, send an email to sales+unsubscribe@windycitymushroom.com."} </email>
        
        <email> </email>
        
        If it is an order, output "yes", if it is not an order, output "no". Output only "yes" or "no". `,
      },
      { role: 'user', content: JSON.stringify(email) },
    ],
  })

  const checkOrder = completion.data.choices[0].message.content

  return checkOrder
}

// `You are an expert at extracting information from Emails. I will give you data about an email in JSON format: message, sender, title.\n

// You mission is to distinguish if the sender is requesting product to the receiver. It should contain one or more items along with their respective quantities. Output only "yes" or "no".\n

// Example 1
// Email: {title: "Maple&Ash", sender: "wes <wes@gmail.com>", message: "3cs oysters"}`,

// 2. Extract customer info (We need to match this to their Quickbooks data), so
// lets just use the customer name email for now

const ParseCustomerInfo = async (email) => {
  const { sender } = email
  //   const completion = await openai.createChatCompletion({
  //     model: "gpt-3.5-turbo",
  //       temperature: 0,
  //     messages: [
  //       {
  //         role: "system",
  //         content: `You will be given an email that a food supplier/distributor received, extracted using the gmail API. Your job is to distinguish whether the email is an order email from the customer or not.\n \
  //         This is a sample email order: \
  //         <email> Title: Etta Bucktown, Content: For tomorrow please: 6 cs oyster mushrooms. thanks! </email>\n \
  //         If it is an order, output "yes", if it is not an order, output "no". Output only "yes" or "no".`,
  //       },
  //       { role: "user", content: userInput },
  //     ],
  //   });

  //   console.log(completion.data.choices[0].message);
  return sender
}

// 3. Extract order details (The prompt should change after integrating QB)
// Input: Email
// Output: order details

// const ParseOrderDetails = async (email) => {
//   const completion = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo',
//     temperature: 0,
//     messages: [
//       {
//         role: 'system',
//         content: `You will be given an email object that a food supplier/distributor received. Extract what the customer is \
//         trying to order in the form of a JSON array of objects. Output must be valid JSON. E.g.[{product, quantity, unit (in lb)}, {product, quantity, unit (in lb)}]. 1 case, or cs, equals to 6 lbs.\n \
//         For example, User: <email> {title: "Etta Bucktown", sender: "Soh Je Yeong <sohjeyeong@gmail.com>", date: "2023-07-10", \
//         message: "For tomorrow please: 6 cs oyster mushrooms. 4 cs lions mane. thanks!"} </email>.
//         Output: [{"product": "oyster mushrooms", "quantity": 36, "unit": "lb"}, {"product": "lions mane", "quantity": 24, "unit": "lb"}]\
//         `,
//       },
//       { role: 'user', content: JSON.stringify(email) },
//     ],
//   })

//   const output = completion.data.choices[0].message.content

//   return output
// }

// 4. Parse Delivery Date
const ParseDeliveryDate = async (email) => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are an expert at extracting information from Emails. I will give you data about an order email that a buyer is sending to a seller in JSON format: message, sender, title, date. Your job is to look into the title and message field to find out the date the buyer is wants it delivered by.

        If the email does not explicitly mention the date or day of week they want it delivered or mentions the same day with the "date field" without requesting specifically for the same day delivery, the sender is expecting to receive the order the next day. 
        
        Only output the answer in the format of “YYYY-MM-DD”. Do not output anything other than "YYYY-MM-DD".
        
          `,
      },
      { role: 'user', content: JSON.stringify(email) },
    ],
  })

  const date = completion.data.choices[0].message.content

  return date
}

// const mapOrderDetails = async (orders, products) => {
//   const chatGPTInput = `Orders: ${JSON.stringify(orders)}

//   Products: ${JSON.stringify(products)}`

//   const completion = await openai.createChatCompletion({
//     model: 'gpt-3.5-turbo',
//     temperature: 0,
//     messages: [
//       {
//         role: 'system',
//         content: `Given an array of Order objects with "product" and "quantity" attributes, and a list of available products, your task is to replace each object's "product" with the closest matching product from the product list.

//         <Example>
//         <Input>
//         Orders: [{ "product": "Mixed Oysters", "quantity": 36 }, { "product": "*Gourmet Blend", "quantity": 36 }]

//         Products: [ 'Services', 'Hours', '*Black Pearl King Trumpet', '*Mixed Oysters', 'Chestnut', 'Maitake', 'Asian Fungitarian', '*Combs Tooth', 'Italian Fungitarian', 'Tinga Fungitarian', 'Gourmet Blend', '*Lions Mane/Combs Tooth', 'Original Fungitarian', 'BBQ Fungitarian' ]
//         </Input>
//         <Output>[{ "product": "*Mixed Oysters", "quantity": 36 }, { "product": "Gourmet Blend", "quantity": 36 }]</Output>
//         </Example>

//         Your goal is to provide clear instructions on identifying the closest matching product in the list and updating the "product" attribute accordingly for each order`,
//       },
//       { role: 'user', content: chatGPTInput },
//     ],
//   })

//   return completion.data.choices[0].message.content
// }

// 3. Parse Order details
const ParseOrderDetails = async (email, products) => {
  //This could be inefficient since we are creating the same list everytime we make a gpt call
  const _formatListOfProducts = () => {
    let productList = []

    for (const { name } of Object.values(products)) {
      productList.push(name)
    }
    const result = JSON.stringify(productList)

    return result
  }

  const { message, title } = email
  const PRODUCTS = _formatListOfProducts()

  const chatGPTInput = `<Input>
Email:
${JSON.stringify({ message, title }, null, 2)}

Products: ${JSON.stringify(PRODUCTS)}

Output the customer's orders in pounds, in JSON format.

<Output>`

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    top_p: 1,
    messages: [
      {
        role: 'system',
        content: `You specialize in extracting data from emails. You will receive email information in JSON format (message, title), along with a JSON product list. Your task is to scan the email, identify requested products, find the closest match in the product list, and determine the quantity in pounds (lb) for each product. It's crucial that the output precisely matches the product names from the given list. Note that 1 "case" or "cs" equals 6 pounds (lb), and "#" represents pounds. Provide the customer's orders in JSON format, specifying the products and their quantities in pounds (lb).

        Example 1
        <Input>
        Email:
        {
          "message": "36# oyster\\r\\n 36# gourmet\\r\\n\\r\\nThank you,\\r\\n",
          "title": "Maple&Ash delivery 7/21"
        }
        
        Products:  ["Services", "Hours", "*Black Pearl King Trumpet", "*Mixed Oysters", "*Chestnut", "Maitake", "Asian Fungitarian", "Combs Tooth", "*Italian Fungitarian", "Tinga Fungitarian", "Gourmet Blend", "Lions Mane/Combs Tooth", "Original Fungitarian", "BBQ Fungitarian"]
        
        Output the customer's orders in pounds(lb), in JSON format.
        
        <Output>
        [
          { "product": "*Mixed Oysters", "quantity": 36 },
          { "product": "Gourmet Blend", "quantity": 36 }
        ]
        
        Example 2
        <Input>
        Email:
        {
          "message": "For tomorrow please\\r\\n\\r\\n2 cs mix mushroom \\r\\n\\r\\nThx\\r\\n",
          "title": "DDG"
        }
        
        Products: ["Services", "Hours", "Black Pearl King Trumpet", "Mixed Oysters!", "Chestnut", "Maitake", "Asian Fungitarian", "Combs Tooth", "Italian Fungitarian", "*Tinga Fungitarian", "*Gourmet Blend!", "Lions Mane/Combs Tooth", "*Original Fungitarian", "BBQ Fungitarian"]
        
        Output the customer's orders in pounds(lb), in JSON format.
        
        <Output>
        [
          { "product": "Mixed Oysters!", "quantity": 12 }
        ]
        
        Example 3
        <Input>
        Email:
        {
          "message": "For tomorrow\\r\\n\\r\\n50# tinga mush and a case Oysters 2 cases of Maitake\\r\\n\\r\\nPlease confirm\\r\\n",
          "title": "Etta river north 700 n clark st"
        }
        
        Products: ["Services", "Hours", "*Black Pearl King Trumpet", "*Mixed Oysters", "Chestnut", "*Maitake", "Asian Fungitarian", "Combs Tooth", "Italian Fungitarian", "Tinga Fungitarian", "Gourmet Blend", "Lions Mane/Combs Tooth", "*Original Fungitarian", "*BBQ Fungitarian"]
        
        Output the customer's orders in pounds(lb), in JSON format.
        
        <Output>
        [
          { "product": "Tinga Fungitarian", "quantity": 50 },
          { "product": "*Mixed Oysters", "quantity": 6 },
          { "product": "*Maitake", "quantity": 12 }
        ]`,
      },
      { role: 'user', content: chatGPTInput },
    ],
  })

  const productInfo = completion.data.choices[0].message.content

  // console.log(productInfo)

  // const orderInfo = mapOrderDetails(productInfo, PRODUCTS)

  return productInfo
}

// 6. Find Customer ID
const ParseCustomerName = async (customers, email) => {
  //This could be inefficient since we are creating the same list everytime we make a gpt call
  const _formatListOfCustomers = () => {
    let customerList = []

    for (const { name } of Object.values(customers)) {
      customerList.push(name)
    }
    const result = JSON.stringify(customerList, null, 2)

    return result
  }

  const { title, sender, message } = email
  const senderEmailOnly = sender.match(/<([^>]+)>/)?.[1] || '' // Email is in the format: (name) <(email)>. This RegEx gets (email) part only.

  const chatGPTInput = `<Input>
Email: ${JSON.stringify({ title, message, sender: senderEmailOnly }, null, 2)}

Customers: ${JSON.stringify(_formatListOfCustomers())}

Your output must match a customer on the list. Pay attention to the "title" and "message" fields with equal amount as "message."

<Output>`

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0,
    messages: [
      {
        role: 'system',
        content: `You are an expert at extracting information from Emails. I will give you data about an email in JSON format: message, sender, title.

I will also give you a list of customers in JSON format. The email provided is sent by one of the customers on the list.

You mission is to choose a customer from the list. Find the closest match.

Example 1
<Input>
Email: {
  "title": "Apolonia order",
  "message": "Hello, for tomorrow please:\\r\\n\\r\\n6# oyster mushroom mix\\r\\n\\r\\nThank you,\\r\\n",
  "sender": "jws@apoloniachicago.com"
}

Customers: [
  "Acanto Restaurant",
  "Alinea",
  "Alkaline Healing Herbs",
  "All Meal Prep",
  "alla vita",
  "Alpha Baking",
  "Amaru",
  "Apolonia",
  "Artisan Specialty Foods Inc",
  "Avec",
  "Avec River North",
  "Avli (Loop)",
  "B Gabs Goodies",
  "bar chido",
  "Bar Siena (Old Orchard)",
  "Bar Siena (West Loop)",
  "Bennett Farms Michigan",
  "Betsy",
  "Big Star Mariscos",
  "Big Star Wicker",
  "Big Star Wrigley",
  "Bloom Plant Based Kitchen",
  "BLT Steak",
  "Boeufhaus",
  "Boka Restaurant",
  "Brite Donuts and Baked Goods",
  "CAA/Cindy's Chicago Athletic Club",
  "Cabra",
  "Cat-Su Sando",
  "Cira",
  "Closed Loop Farms",
  "Conscious Plates",
  "Cooks Canvas",
  "Coralee",
  "DePaul",
  "Dill Pickle Co Op",
  "Don Bucio Taqueria",
  "Doves",
  "Duck Duck Goat",
  "duseks",
  "Earth Angel Mushrooms",
  "Eat Second Generation",
  "Edaphon Farm",
  "Edgewater Produce",
  "El Che",
  "El Hongo Magico Tacos",
  "Entree",
  "Etta Bucktown",
  "Etta River North",
  "Euro USA",
  "Farmers Insurance",
  "Farmers Market Cash Sales",
  "Four Star Mushroom",
  "Frontera Group",
  "Fulton Market Kitchen",
  "GIrl and the Goat",
  "Green Market Link Reimbursement",
  "Gretel",
  "Harvest Time Foods",
  "Heritage",
  "Homestead on The Roof",
  "Illinois Secretary of State",
  "Jaleo",
  "Jethro C& C Ent",
  "Johnny Stan",
  "KitchFix",
  "L&M Fine Foods",
  "Liem Le",
  "Little Eddie's Pizza",
  "Little Goat",
  "Local Foods",
  "Maple and Ash",
  "Meek's Vegan Kitchen",
  "Mike Rericha",
  "MIke Sundstrom Profesor Pizza",
  "Moes",
  "Mon Ami Gabi",
  "Mushroom Queen",
  "Niche Catering",
  "Nico Osteria",
  "Ocean Prime",
  "One North Kitchen & Bar",
  "Pete's Fresh Market",
  "Pizza Friendly Pizza",
  "plant chicago",
  "Planta Queen",
  "professor pizza",
  "Publican Bread",
  "Publican Quality Meats",
  "Publican Restaurant",
  "R & R",
  "Range Restaurant",
  "RAWNRGY",
  "Regalis Chicago LLC",
  "RFD",
  "Open Produce",
  "RPM Italian",
  "RPM Seafood",
  "RPM Steak",
  "S.K.Y",
  "Sienna Tavern",
  "Spira Farms",
  "Spirit Elephant",
  "Spotify",
  "starfarms",
  "Sugar Beet Food Co-Op",
  "Sweet Vegan Bakes",
  "Tastes of Bri",
  "The Black Vegan Restaurant",
  "The Gage",
  "The Paramount Group",
  "The Roof Crop",
  "Thrive Mushroom",
  "Tortello",
  "Tottos Market",
  "Urban Canopy, Inc.",
  "Valhalla",
  "Via Carducci La Sorella",
  "Vie Restaurant",
  "Village Farm Stand",
  "Violet Hour",
  "Vosges Haut-Chocolat",
  "Vu Roofttop",
  "Wabash Seafood",
  "Wazwan",
  "Westmoreland Country Club",
  "Test Restaurant"
]

Your output must match a customer on the list. Pay attention to the "title" and "message" fields with equal amount as "message."

<Output>
Apolonia

Example 2
<Input>
Email: {
  "title": "Order",
  "message": "Peace y'all,\\r\\n\\r\\nCan we get 2 boxes of Oyster Mushrooms delivered tomorrow?\\r\\n\\r\\nGratitude,\\r\\nLatrell\\r\\n",
  "sender": "latrell@consciousplates.com"
}

Customers: [
  "Acanto Restaurant",
  "Alinea",
  "Alkaline Healing Herbs",
  "All Meal Prep",
  "alla vita",
  "Alpha Baking",
  "Amaru",
  "Apolonia",
  "Artisan Specialty Foods Inc",
  "Avec",
  "Avec River North",
  "Avli (Loop)",
  "B Gabs Goodies",
  "bar chido",
  "Bar Siena (Old Orchard)",
  "Bar Siena (West Loop)",
  "Bennett Farms Michigan",
  "Betsy",
  "Big Star Mariscos",
  "Big Star Wicker",
  "Big Star Wrigley",
  "Bloom Plant Based Kitchen",
  "BLT Steak",
  "Boeufhaus",
  "Boka Restaurant",
  "Brite Donuts and Baked Goods",
  "CAA/Cindy's Chicago Athletic Club",
  "Cabra",
  "Cat-Su Sando",
  "Cira",
  "Closed Loop Farms",
  "Conscious Plates",
  "Cooks Canvas",
  "Coralee",
  "DePaul",
  "Dill Pickle Co Op",
  "Don Bucio Taqueria",
  "Doves",
  "Duck Duck Goat",
  "duseks",
  "Earth Angel Mushrooms",
  "Eat Second Generation",
  "Edaphon Farm",
  "Edgewater Produce",
  "El Che",
  "El Hongo Magico Tacos",
  "Entree",
  "Etta Bucktown",
  "Etta River North",
  "Euro USA",
  "Farmers Insurance",
  "Farmers Market Cash Sales",
  "Four Star Mushroom",
  "Frontera Group",
  "Fulton Market Kitchen",
  "GIrl and the Goat",
  "Green Market Link Reimbursement",
  "Gretel",
  "Harvest Time Foods",
  "Heritage",
  "Homestead on The Roof",
  "Illinois Secretary of State",
  "Jaleo",
  "Jethro C& C Ent",
  "Johnny Stan",
  "KitchFix",
  "L&M Fine Foods",
  "Liem Le",
  "Little Eddie's Pizza",
  "Little Goat",
  "Local Foods",
  "Maple and Ash",
  "Meek's Vegan Kitchen",
  "Mike Rericha",
  "MIke Sundstrom Profesor Pizza",
  "Moes",
  "Mon Ami Gabi",
  "Mushroom Queen",
  "Niche Catering",
  "Nico Osteria",
  "Ocean Prime",
  "One North Kitchen & Bar",
  "Pete's Fresh Market",
  "Pizza Friendly Pizza",
  "plant chicago",
  "Planta Queen",
  "professor pizza",
  "Publican Bread",
  "Publican Quality Meats",
  "Publican Restaurant",
  "R & R",
  "Range Restaurant",
  "RAWNRGY",
  "Regalis Chicago LLC",
  "RFD",
  "Open Produce",
  "RPM Italian",
  "RPM Seafood",
  "RPM Steak",
  "S.K.Y",
  "Sienna Tavern",
  "Spira Farms",
  "Spirit Elephant",
  "Spotify",
  "starfarms",
  "Sugar Beet Food Co-Op",
  "Sweet Vegan Bakes",
  "Tastes of Bri",
  "The Black Vegan Restaurant",
  "The Gage",
  "The Paramount Group",
  "The Roof Crop",
  "Thrive Mushroom",
  "Tortello",
  "Tottos Market",
  "Urban Canopy, Inc.",
  "Valhalla",
  "Via Carducci La Sorella",
  "Vie Restaurant",
  "Village Farm Stand",
  "Violet Hour",
  "Vosges Haut-Chocolat",
  "Vu Roofttop",
  "Wabash Seafood",
  "Wazwan",
  "Westmoreland Country Club",
  "Test Restaurant"
]

Your output must match a customer on the list. Pay attention to the "title" and "message" fields with equal amount as "message."

<Output>
Conscious Plates`,
      },
      { role: 'user', content: chatGPTInput },
    ],
  })

  const customer = completion.data.choices[0].message.content

  return customer
}

// Test
// filterOrderEmail(orderEx1)
// ParseCustomerInfo(orderEx1)
//ParseOrderDetails(orderEx1, FULL_PRODUCT_LIST)
// ParseDeliveryDate(orderEx1)

module.exports = {
  filterOrderEmail,
  // ParseCustomerInfo,
  ParseOrderDetails,
  ParseDeliveryDate,
  ParseCustomerName,
  // getProductId,
  // getCustomerName,
}
