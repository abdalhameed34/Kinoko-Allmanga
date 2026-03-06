const { ParsedCollection } = require('./collection');

class MainController extends Controller {
    load(data) {
        // 1. Initialize the scraper with the AllManga URL from the tab
        this.collection = ParsedCollection.new(data);
        
        // 2. Find our new bulletproof list
        this.list = this.findElement('manga_list');
        
        // 3. Bind the scraper to the list (This triggers the network request)
        if (this.list) {
            this.list.setCollection(this.collection);
            
            // Make the manga clickable
            this.list.onItemClick = (item) => {
                this.openBook(item);
            };
        }
    }
}

module.exports = MainController;
