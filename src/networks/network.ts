export const fetcher = (url: string, options: any) => fetch(url).then((res) => res.json())
