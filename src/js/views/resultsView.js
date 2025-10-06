import { View } from './Views.js';
import perviewView from './perviewView.js';

class resultView extends View {
  _parentElement = document.querySelector('.results');
  _messageError = 'No recipes found for your query! please try again';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(el => perviewView._generateMarkupPerview(el))
      .join('');
  }
}

export default new resultView();
