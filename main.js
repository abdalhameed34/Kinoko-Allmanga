class MainController extends Controller {
    load(data) {
        // Find the list, but don't attach any data to it yet.
        // We just want to see if the tab can open without killing the app.
        this.list = this.findElement('manga_list');
    }
}

module.exports = MainController;
