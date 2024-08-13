# Microsoft PartnerCenter and Graph API SDK for NodeJS

## Getting Started

You can install the package with the following command:

```bash
npm install microsoft-partnercenter
```

or

```bash
yarn add microsoft-partnercenter
```

or

```bash
pnpm install microsoft-partnercenter
```

### Partner Center API

Initialize with Client ID and Client Secret Auth & Partner Domain:

```javascript
import { MicrosoftPartnerCenter } from "microsoft-partnercenter"

const msPartnerCenter = new MicrosoftPartnerCenter({
  partnerDomain: "partner.onmicrosoft.com",
  authentication: {
    clientId: "1",
    clientSecret: "1",
  },
})
```

### Graph API

Initialize with Client ID, Client Secret, and Tenant ID:

```javascript
import { MicrosoftGraphApi } from "microsoft-partnercenter"

const msGraphApi = new MicrosoftGraphApi({
  tenantId: "your-tenant-id",
  authentication: {
    clientId: "1",
    clientSecret: "1",
  },
})
```

## Example Usage

### Partner Center API

#### Get all Customers

```javascript
await msPartnerCenter.getAllCustomers()
```

#### Create Order

```javascript
const customerId = "123"
const billingCycle = "monthly"

const lineItems = [
  {
    offerId: "1",
    quantity: 16,
    termDuration: "P1M",
  },
]

await msPartnerCenter.createOrder(customerId, billingCycle, lineItems)
```

### Graph API

#### Create a GDAP Relationship

```javascript
const relationship = await msGraphApi.createGDAPRelationship({
  displayName: "My GDAP Relationship",
  partner: {
    tenantId: "partner-tenant-id",
  },
  customer: {
    tenantId: "customer-tenant-id",
  },
  accessDetails: {
    unifiedRoles: ["Directory Readers"],
  },
  duration: "P90D",
})
```

#### Get All GDAP Relationships

```javascript
const relationships = await msGraphApi.getAllGDAPRelationships()
```

#### Create a Domain

```javascript
const domain = await msGraphApi.createDomain("example.com")
```

#### List Domains

```javascript
const domains = await msGraphApi.listDomains()
```

## Authentication

Both the Partner Center API and Graph API support authentication using client credentials (client ID and client secret). The SDK handles token management and renewal automatically.

## Error Handling

The SDK includes built-in error handling and will automatically retry on certain errors (e.g., 401 Unauthorized). You can configure retry behavior in the config object:

```javascript
const msPartnerCenter = new MicrosoftPartnerCenter({
  // ... other config
  conflict: {
    retryOnConflict: true,
    retryOnConflictDelayMs: 1000,
    maximumRetries: 3,
  },
})
```

## Documentation

For more detailed information about available methods and their parameters, please refer to the TypeScript definitions included with this package.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request
