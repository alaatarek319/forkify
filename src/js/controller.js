import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import bookmarksView from './views/bookMarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // renderSpinner(recipeContainer);
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0) update results view & bookmarks view
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.BookMarks);

    // 1) load Recipe
    await model.loadRecipe(id);
    // 2) render Recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearch = async function () {
  try {
    // 1) getQuery
    const query = searchView.getQuery();

    // 2) loadSearch
    await model.loadSearchresult(query);

    // 3) renderResults
    resultView.render(model.getSearchResultsPage());

    // 4) renderPagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultView.renderError();
  }
};

const controlPagination = function (goTOpage) {
  // 3) renderResults
  resultView.render(model.getSearchResultsPage(goTOpage));

  // 4) render pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) update servings
  model.updateServings(newServings);

  // 2) update Recipe
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookMarked) model.addBookMark(model.state.recipe);
  else model.removeBookMark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.BookMarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.BookMarks);
};

const controlUploadRecipes = async function (data) {
  try {
    // upload Recipe
    await model.uploadRecipe(data);

    // Render recipe
    recipeView.render(model.state.recipe);

    // render bookmark view
    bookmarksView.render(model.state.BookMarks);

    // change ID in URL
    window.history.pushState(null, '', model.state.recipe.id);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerupdateServings(controlServings);
  recipeView.addHandlerBookMark(controlAddBookmark);
  searchView.addHandlerRender(controlSearch);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlUploadRecipes);
};
init();
