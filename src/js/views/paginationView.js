import { View } from './Views.js';
import icon from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerRender(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    let buttons = '';

    // Last page or Other page
    if (
      (curPage === numPages && numPages > 1) ||
      (curPage > 1 && curPage < numPages)
    )
      buttons += this._generateMarkupbtn('prev', 'left');

    // page 1, there are other pages
    if ((curPage === 1 && numPages > 1) || (curPage > 1 && curPage < numPages))
      buttons += this._generateMarkupbtn('next', 'right');

    // page 1, there are no other pages
    return buttons;
  }

  _generateMarkupbtn(seq, dir) {
    const curPage = this._data.page;
    const goto = seq === 'prev' ? curPage - 1 : curPage + 1;
    return `
        <button data-goto="${goto}" class="btn--inline pagination__btn--${seq}">
          <svg class="search__icon">
            <use href="${icon}#icon-arrow-${dir}"></use>
          </svg>
          <span>Page ${goto}</span>
        </button>
    `;
  }
}

export default new paginationView();
