export interface DataEverything {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

export interface DataSources {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
}

export interface ContentCreator {
    draw(data: DataEverything[] | DataSources[]): void;
}

interface ResponseObj {
    status: string;
    totalResults: number;
    articles: DataEverything[] | [];
    sources: DataSources[] | [];
}

export type Articles = Pick<ResponseObj, 'status' | 'totalResults' | 'articles'>;

export type SourcesEndpoint = Pick<ResponseObj, 'status' | 'sources'>;

export type VoidFunc<T> = (data: T) => void;

export enum ErrorStatuses {
    'OK' = 200,
    'Bad Request' = 400,
    'Unauthorized' = 401,
    'Not Found' = 404,
    'Too Many Requests' = 429,
    'Server Error' = 500,
}

type RequiredRequestParams = {
    apiKey: string;
};

type RequestParams = {
    q: string;
    searchIn: 'title' | 'description' | 'content';
    sources: string;
    domains: string;
    excludeDomains: string;
    from: string;
    to: string;
    language: string;
    sortBy: string;
    pageSize: number;
    page: number;
    category: string;
    country: string;
    [key: string]: string | number;
};

export type RequestParameters = Required<RequiredRequestParams> & Partial<RequestParams>;
