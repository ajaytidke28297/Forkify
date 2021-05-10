import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarkView from "./views/bookmarkView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODAL_CLOSE_SEC } from "./config.js";

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSprinner();
    await model.loadRecipe(id);

    //Update results view to highlight the selected recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarkView.update(model.state.bookMarks);

    //3)Render Results
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSprinner();

    //1) Get Search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search results
    await model.loadSearchResults(query);

    //3)Render Results
    resultsView.render(model.getSearchResultsPage());

    //4) Render initial Pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlPagination = function (gotoPage) {
  //1)Render Results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //2) Render initial Pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  //Update the recipe servings
  model.updateServings(newServing);

  //update the view
  recipeView.render(model.state.recipe);
};

const controlBookmark = function () {
  //1)Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)Update recipe view
  recipeView.update(model.state.recipe);

  //3)Render bookmarks
  bookmarkView.render(model.state.bookMarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSprinner();

    // UPload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render on UI
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarkView.render(model.state.bookMarks);

    // Change ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // Close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
