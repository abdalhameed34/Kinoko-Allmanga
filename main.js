// Import the collection classes we adapted earlier
const { ParsedCollection } = require('./collection');

class MainController extends Controller {
    
    // 'data' contains the tab info, e.g., { title: "All Manga", url: "https://allmanga.to/manga?cty=ALL" }
    load(data) {
        // Initialize our AllManga scraper with the tab's URL
        this.collection = ParsedCollection.new(data);
        
        // Find the list element from main.xml
        this.list = this.findElement('manga_list');
        
        // Bind the data to the UI. Kinoko will automatically call this.collection.reload()
        this.list.setCollection(this.collection);
        
        // Set an action for when a user taps a manga cover
        this.list.onItemClick = (item) => {
            // Open the detail page for that specific manga
            this.openBook(item);
        };
    }

    unload() {
        // Clean up when leaving the tab
    }
}

module.exports = MainController;
