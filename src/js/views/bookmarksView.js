import { View } from './Views.js';
import perviewView from './perviewView.js';

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _messageError = 'No bookmarks yet. Find a nice recipe and book mark it ;)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(el => perviewView._generateMarkupPerview(el))
      .join('');
  }
}

export default new BookMarksView();
