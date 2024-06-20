import { BaseComponent } from '../components/base-components';
import { STORE, updateStoreWinners } from '../store/store';
import { WinnerTableType } from '../API/types';
import { CreateWinner } from './winner-row.ts/row';
import './winners-style.css';
import { CreatePaggination } from '../navigation/winners-pagination';
import { WINNERS_PAGE_LIMIT } from '../API/RaceAPI';

class WinnersWrapper extends BaseComponent {
  private readonly WinnersCounter: BaseComponent;

  private readonly PageCounter: BaseComponent;

  private readonly WinnersList: BaseComponent;

  private readonly WinsSort: BaseComponent;

  private readonly TimeSort: BaseComponent;

  private readonly Pagination;

  constructor() {
    super({ className: 'winners__wrapper' });
    this.WinnersCounter = new BaseComponent({ tag: 'h2', className: 'winners-count' });
    this.PageCounter = new BaseComponent({ tag: 'h3', className: 'winners-page' });
    this.WinnersList = new BaseComponent({ tag: 'ul', className: 'winners-list' });
    this.WinsSort = new BaseComponent({ className: 'col-4', text: 'Wins' });
    this.WinsSort.addEventListener('click', () => {
      STORE.winnersSort = 'wins';
      const curOrder = STORE.toggleSortOrder();
      this.WinsSort.getNode().className = 'col-4';
      this.WinsSort.addClass(`active_${curOrder}`);
      this.TimeSort.getNode().className = 'col-5';
      this.render();
    });
    this.TimeSort = new BaseComponent({ className: 'col-5', text: 'Best time' });
    this.TimeSort.addEventListener('click', () => {
      STORE.winnersSort = 'time';
      const curOrder = STORE.toggleSortOrder();
      this.TimeSort.getNode().className = 'col-5';
      this.TimeSort.addClass(`active_${curOrder}`);
      this.WinsSort.getNode().className = 'col-4';
      this.render();
    });
    const WinnerHeader = new BaseComponent(
      { className: 'row row_header' },
      new BaseComponent({ className: 'col-1', text: 'Number' }),
      new BaseComponent({ className: 'col-2', text: 'Car' }),
      new BaseComponent({ className: 'col-3', text: 'Name' }),
      this.WinsSort,
      this.TimeSort
    );
    this.Pagination = CreatePaggination(() => this.render());
    this.appendChildren([this.WinnersCounter, this.PageCounter, WinnerHeader, this.WinnersList, this.Pagination]);
  }

  public async render() {
    await updateStoreWinners();
    this.renderWinnersCounter();
    this.renderWinners();
    this.Pagination.updatePagination();
  }

  private renderWinnersCounter() {
    this.WinnersCounter.text(`Winners (${STORE.totalWinners})`);
    this.PageCounter.text(`Page # ${STORE.winnersPage} / ${STORE.totalWinnersPages}`);
  }

  private renderWinners() {
    this.WinnersList.deleteChildren();
    const winnersArr = STORE.winners.map((winner: WinnerTableType, index: number) => {
      return CreateWinner(
        { color: winner.color, name: winner.name, wins: winner.wins, time: winner.time },
        index + 1 + WINNERS_PAGE_LIMIT * (STORE.winnersPage - 1)
      );
    });
    if (winnersArr.length === 0) {
      this.WinnersList.append(new BaseComponent({ className: 'empty-table', text: 'No winners yet' }));
      return;
    }
    this.WinnersList.appendChildren(winnersArr);
  }
}

export const CreateWinnerPage = () => new WinnersWrapper();
