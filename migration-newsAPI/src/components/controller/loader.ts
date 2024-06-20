import { ErrorStatuses, RequestParameters, VoidFunc } from '../../utils/types';

type EndPoints = 'everything' | 'top-headlines' | 'sources';
type UrlOption = Partial<RequestParameters>;

class Loader {
    baseLink: string | undefined;
    options: UrlOption;

    constructor(baseLink: string | undefined, options: UrlOption) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options = {} }: { endpoint: EndPoints; options?: UrlOption },
        callback: VoidFunc<T>
    ): void {
        if (!callback) {
            callback = () => console.error('No callback for GET response');
        }
        this.load('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response | never {
        if (!res.ok) {
            if (res.status === ErrorStatuses['Unauthorized'] || res.status === ErrorStatuses['Not Found'])
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: UrlOption, endpoint: EndPoints): string {
        const urlOptions = { ...this.options, ...options };
        let url: string = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    private load<T>(method: 'GET', endpoint: EndPoints, callback: VoidFunc<T>, options: UrlOption = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res) => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;
