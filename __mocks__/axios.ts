const mockAxios: any = jest.fn(() => Promise.resolve({ data: {} }))

mockAxios.get = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.post = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.put = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.patch = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.delete = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.head = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.options = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.request = jest.fn(() => Promise.resolve({ data: {} }))
mockAxios.all = jest.fn(() => Promise.resolve([]))
mockAxios.spread = jest.fn((callback: any) => callback)
mockAxios.create = jest.fn(() => mockAxios)
mockAxios.isAxiosError = jest.fn()
mockAxios.AxiosError = class AxiosError extends Error {}
mockAxios.interceptors = {
    request: {
        use: jest.fn(),
        eject: jest.fn(),
        clear: jest.fn(),
    },
    response: {
        use: jest.fn(),
        eject: jest.fn(),
        clear: jest.fn(),
    },
}
mockAxios.defaults = {
    headers: {
        common: {},
        get: {},
        post: {},
        put: {},
        patch: {},
        delete: {},
        head: {},
    },
}
mockAxios.reset = () => {
    mockAxios.mockReset()
    mockAxios.get.mockReset()
    mockAxios.post.mockReset()
    mockAxios.put.mockReset()
    mockAxios.patch.mockReset()
    mockAxios.delete.mockReset()
    mockAxios.head.mockReset()
    mockAxios.options.mockReset()
    mockAxios.request.mockReset()
    mockAxios.all.mockReset()
    mockAxios.create.mockClear()
    mockAxios.interceptors.request.use.mockClear()
    mockAxios.interceptors.request.eject.mockClear()
    mockAxios.interceptors.response.use.mockClear()
    mockAxios.interceptors.response.eject.mockClear()
}

export default mockAxios
