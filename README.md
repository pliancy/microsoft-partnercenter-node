# Microsoft PartnerCenter RestAPI SDK for NodeJS

## Getting Started

You can install the package with the following command:

```javascript
npm install microsoft-partnercenter
```

```javascript
yarn add microsoft-partnercenter
```

Import the package 

```javascript
import { MicrosoftPartnerCenter } from 'microsoft-partnercenter'
```

Initialize with Client ID and Client Secret Auth & Partner Domain:


```javascript
  const msPartnerCenter = new MicrosoftPartnerCenter ({
        partnerDomain: 'partner.onmicrosoft.com',
        authentication: {
            clientId: '1',
            clientSecret: '1',
        },
    })
```

## Example Usage

### Get all Customers

```javascript
await msPartnerCenter.getAllCustomers()
```

### Create Order

```javascript
const customerId = '123'
const billingCycle = 'monthly'

const lineItems = [
  {
    offerId: '1',
    quantity: 16,
    termDuration: 'P1M',
},
]

await msPartnerCenter.createOrder(customerId, billingCycle, lineItems)
```

