import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface GraphCollectionResponse<T> {
    value?: T[]
    '@odata.nextLink'?: string
}

export async function getPagedGraphCollection<T>(
    http: AxiosInstance,
    initialUrl: string,
    config?: AxiosRequestConfig,
): Promise<T[]> {
    const items: T[] = []
    let nextUrl: string | undefined = initialUrl
    let isFirstRequest = true

    while (nextUrl) {
        const response: AxiosResponse<GraphCollectionResponse<T>> =
            isFirstRequest && config
                ? await http.get<GraphCollectionResponse<T>>(nextUrl, config)
                : await http.get<GraphCollectionResponse<T>>(nextUrl)
        const { data } = response

        items.push(...(data.value ?? []))
        nextUrl = data['@odata.nextLink']
        isFirstRequest = false
    }

    return items
}
