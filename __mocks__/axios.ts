import mockAxios from 'jest-mock-axios'

// mocks must be exported from the root of the project, so we import from node_modules and simply
// re-export

// this is the key to fix the axios.create() undefined error!

export default mockAxios
