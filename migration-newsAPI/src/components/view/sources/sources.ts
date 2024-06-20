import { isNonNullable } from '../../../utils/guards';
import { ContentCreator, DataSources } from '../../../utils/types';
import './sources.css';

class Sources implements ContentCreator {
    public draw(data: DataSources[]): void {
        const fragment: DocumentFragment = document.createDocumentFragment();
        const sourceItemTemp: HTMLTemplateElement | null = document.querySelector('#sourceItemTemp');
        isNonNullable(sourceItemTemp);

        data.forEach((item: Readonly<DataSources>): void => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);
            if (!(sourceClone instanceof DocumentFragment)) throw new Error(`${sourceClone} is not expected type`);

            const itemName: HTMLSpanElement | null = sourceClone.querySelector('.source__item-name');
            isNonNullable(itemName);
            itemName.textContent = item.name;

            const sourceItem: HTMLDivElement | null = sourceClone.querySelector('.source__item');
            isNonNullable(sourceItem);
            sourceItem.setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        const sourcesMain: HTMLDivElement | null = document.querySelector('.sources');
        isNonNullable(sourcesMain);
        sourcesMain.append(fragment);
    }
}

export default Sources;
