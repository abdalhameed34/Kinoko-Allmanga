class IndexController extends Controller {
    load() {
        // 1. Find the list directly inside our new tab
        this.list = this.findElement('manga_list');
        
        // 2. Create an offline, fake collection
        let mockCollection = glib.Collection.new();
        mockCollection.reload = function(_, cb) {
            let item = glib.DataItem.new();
            item.title = "THE LIST SURVIVED!";
            item.subtitle = "We can safely put lists inside tabs.";
            
            this.setData([item]);
            cb.apply(null);
            return true;
        };
        
        // 3. Bind the data
        if (this.list) {
            this.list.setCollection(mockCollection);
        }
    }
}

module.exports = IndexController;
