import { Articles, ContentCreator, SourcesEndpoint } from '../../utils/types';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    news: ContentCreator;
    sources: ContentCreator;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data: Articles): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data: SourcesEndpoint): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
