import { isNonNullable } from '../../../utils/guards';
import { ContentCreator, DataEverything } from '../../../utils/types';
import './news.css';

class News implements ContentCreator {
    public draw(data: DataEverything[]): void {
        const news: DataEverything[] = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const newsItemTemp: HTMLTemplateElement | null = document.querySelector('#newsItemTemp');
        isNonNullable(newsItemTemp);

        news.forEach((item: Readonly<DataEverything>, idx: number): void => {
            const newsClone = newsItemTemp.content.cloneNode(true);
            if (!(newsClone instanceof DocumentFragment)) throw new Error(`${newsClone} is not expected type`);

            if (idx % 2) {
                const newsItem: HTMLDivElement | null = newsClone.querySelector('.news__item');
                isNonNullable(newsItem);
                newsItem.classList.add('alt');
            }

            const metaPhoto: HTMLDivElement | null = newsClone.querySelector('.news__meta-photo');
            isNonNullable(metaPhoto);
            metaPhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;

            const metaAuthor: HTMLLIElement | null = newsClone.querySelector('.news__meta-author');
            isNonNullable(metaAuthor);
            metaAuthor.textContent = item.author || item.source.name;

            const metaDate: HTMLLIElement | null = newsClone.querySelector('.news__meta-date');
            isNonNullable(metaDate);
            metaDate.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

            const descriptionTitle: HTMLHeadingElement | null = newsClone.querySelector('.news__description-title');
            isNonNullable(descriptionTitle);
            descriptionTitle.textContent = item.title;

            const descriptionSource: HTMLHeadingElement | null = newsClone.querySelector('.news__description-source');
            isNonNullable(descriptionSource);
            descriptionSource.textContent = item.source.name;

            const descriptionContent: HTMLParagraphElement | null =
                newsClone.querySelector('.news__description-content');
            isNonNullable(descriptionContent);
            descriptionContent.textContent = item.description;

            const readMoreLink: HTMLLinkElement | null = newsClone.querySelector('.news__read-more a');
            isNonNullable(readMoreLink);
            readMoreLink.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const newsMain: HTMLDivElement | null = document.querySelector('.news');
        isNonNullable(newsMain);
        newsMain.innerHTML = '';
        newsMain.appendChild(fragment);
    }
}

export default News;
