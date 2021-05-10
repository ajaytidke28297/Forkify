import PreviewView from "./previewView";
import View from "./View";

class BookmarkView extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _errroMessage = "No bookmark found, find a good recipe and bookmark it 😉";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }

  _generateMarkup() {
    return this._data
      .map((bookmark) => PreviewView.render(bookmark, false))
      .join("");
  }
}

export default new BookmarkView();
