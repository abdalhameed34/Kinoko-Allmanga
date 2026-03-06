class IndexController extends Controller {
    
    load() {
        // 1. Find the list directly on the index page
        this.list = this.findElement('manga_list');
        
        // 2. Create the fake data collection
        let mockCollection = glib.Collection.new();
        
        mockCollection.reload = function(_, cb) {
            let item = glib.DataItem.new();
            item.title = "ROUTING WAS THE PROBLEM!";
            item.subtitle = "The widget tag was silently failing the whole time.";
            
            this.setData([item]);
            cb.apply(null);
            return true;
        };
        
        // 3. Bind it
        this.list.setCollection(mockCollection);
    }
}

module.exports = IndexController;
