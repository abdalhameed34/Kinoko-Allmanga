const { ParsedCollection } = require('./collection');

class IndexController extends Controller {
    load() {
        // 1. Create a data object with the AllManga Latest Updates URL
        let targetData = glib.DataItem.new();
        targetData.link = "https://allmanga.to/search-manga?cty=ALL";
        
        // 2. Initialize your scraper from collection.js
        this.collection = ParsedCollection.new(targetData);
        
        // 3. Find the list and bind the scraper to it
        this.list = this.findElement('manga_list');
        this.list.setCollection(this.collection);
        
        // 4. Make the items clickable
        this.list.onItemClick = (item) => {
            this.openBook(item);
        };
    }
}

module.exports = IndexController;
