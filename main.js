class MainController extends Controller {
    load(data) {
        // 1. Find our newly scaffolded list
        this.list = this.findElement('list');
        
        // 2. Create a basic, native collection
        let safeCollection = glib.Collection.new();
        
        // 3. Override it with our test data
        safeCollection.reload = function(page, cb) {
            let item = glib.DataItem.new();
            item.title = "THE REFRESH LAYOUT WORKED!";
            item.subtitle = "The Unbounded Height error is fixed.";
            
            this.setData([item]);
            if (cb) cb(); // Safely call the callback
            return true;
        };
        
        // 4. Bind the data to the UI
        if (this.list) {
            this.list.setCollection(safeCollection);
        }
    }
}

module.exports = MainController;
