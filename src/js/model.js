import 'regenerator-runtime/runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
import resultsView from './views/resultsView.js';
import { forEach } from 'core-js/./es/array';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  BookMarks: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    publisher: recipe.publisher,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadSearchresult = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const { data } = await AJAX(`${API_URL}?search=${query}`);

    state.search.results = data.recipes.map(recipe => {
      return {
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        title: recipe.title,
        id: recipe.id,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (error) {
    throw error;
  }
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipe(data);

    if (state.BookMarks.some(book => book.id === id))
      state.recipe.bookMarked = true;
    else state.recipe.bookMarked = false;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  state.search.page = page;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity =
      (ingredient.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('BookMarks', JSON.stringify(state.BookMarks));
};

export const addBookMark = function (recipe) {
  state.BookMarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;

  persistBookmarks();
};

export const removeBookMark = function (id) {
  const index = state.BookMarks.findIndex(el => el.id === id);
  state.BookMarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookMarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('BookMarks');
  if (storage) state.BookMarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format.'
          );
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookMark(state.recipe);
  } catch (error) {
    throw error;
  }
};

// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };
// clearBookmarks();
