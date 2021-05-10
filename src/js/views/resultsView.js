import PreviewView from "./previewView";
import View from "./View";

class ResultsView extends View {
  _parentElement = document.querySelector(".results");
  _errroMessage = "No recipes found for your query! please try again 😉";
  _message = "";

  _generateMarkup() {
    return this._data
      .map((result) => PreviewView.render(result, false))
      .join("");
  }
}

export default new ResultsView();
