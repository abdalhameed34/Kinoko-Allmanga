const { ParsedCollection } = require('./collection');

class MainController extends Controller {
    load(data) {
        this.collection = ParsedCollection.new(data);
        this.list = this.findElement('manga_list');
        
        if (this.list) {
            this.list.setCollection(this.collection);
            this.list.onItemClick = (item) => {
                this.openBook(item);
            };
        }
    }
}

module.exports = MainController;
