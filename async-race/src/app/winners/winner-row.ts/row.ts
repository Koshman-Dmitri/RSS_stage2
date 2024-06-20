import { BaseComponent } from '../../components/base-components';
import { WinnerTableType } from '../../API/types';
import { paintCar } from '../../garage/car/car';
import './row-style.css';

class Winner extends BaseComponent {
  constructor({ color, name, wins, time }: WinnerTableType, num: number) {
    const carImg = new BaseComponent({ className: 'col-2' });
    carImg.getNode().innerHTML = paintCar(color);
    super(
      { className: 'row' },
      new BaseComponent({ className: 'col-1', text: String(num) }),
      carImg,
      new BaseComponent({ className: 'col-3', text: name }),
      new BaseComponent({ className: 'col-4', text: String(wins) }),
      new BaseComponent({ className: 'col-5', text: String(time) })
    );
  }
}

export const CreateWinner = (props: WinnerTableType, num: number) => new Winner(props, num);
