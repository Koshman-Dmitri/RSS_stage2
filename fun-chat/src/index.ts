import { ChatAPI } from './app/API/ChatAPI';
import App from './app/app';

const id = setInterval(() => {
  if (ChatAPI.socket.readyState === 1) {
    clearInterval(id);
    App.start();
  }
}, 100);
