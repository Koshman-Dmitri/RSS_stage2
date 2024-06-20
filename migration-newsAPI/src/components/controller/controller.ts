import { Articles, SourcesEndpoint } from '../../utils/types';
import AppLoader from './appLoader';
import { VoidFunc } from '../../utils/types';
import { isNonNullable } from '../../utils/guards';

class AppController extends AppLoader {
    public getSources(callback: VoidFunc<SourcesEndpoint>): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    public getNews(e: Event, callback: VoidFunc<Articles>): void {
        let target: EventTarget | null = e.target;
        const newsContainer: EventTarget | null = e.currentTarget;
        isNonNullable(newsContainer);

        while (target !== newsContainer) {
            if (target instanceof HTMLElement && target.classList.contains('source__item')) {
                const sourceId: string | null = target.getAttribute('data-source-id');
                isNonNullable(sourceId);
                if (newsContainer instanceof HTMLDivElement && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            isNonNullable(target);
            target = (target as HTMLElement).parentNode;
        }
    }
}

export default AppController;
