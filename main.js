const { ParsedCollection } = require('./collection');

class MainController extends Controller {
    load(data) {
        // 1. Initialize the scraper with the URL from the tab
        this.collection = ParsedCollection.new(data);
        
        // 2. Find our simple text list
        this.list = this.findElement('manga_list');
        
        // 3. Bind the data (This triggers the network request)
        this.list.setCollection(this.collection);
        
        // 4. Make the text items clickable
        this.list.onItemClick = (item) => {
            this.openBook(item);
        };
    }
}

module.exports = MainController;
