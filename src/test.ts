import MSPC from '.'

const mspc = new MSPC({
  partnerDomain: 'pliancy.onmicrosoft.com',
  authentication: {
    clientId: '353d8f0c-5882-4241-bdfc-4ffef7465b78',
    clientSecret: ']?@m1rSc?fxVJ9VkOZCkQTpjYHPYA1V4',
  },
})

mspc.getAllCustomers().then(console.log).catch(console.log)
