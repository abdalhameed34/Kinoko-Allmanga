class MainController extends Controller {
    load(data) {
        // 1. Find the explicitly sized list
        this.list = this.findElement('manga_list');
        
        // 2. Use the native glib object directly (no custom classes)
        let mockCollection = glib.Collection.new();
        
        // 3. Override its internal reload function
        mockCollection.reload = function(page, cb) {
            let item = glib.DataItem.new();
            item.title = "THE LIST IS ALIVE!";
            item.subtitle = "We fixed the silent JS error and layout collapse.";
            
            this.setData([item]);
            cb(); 
            return true;
        };
        
        // 4. Bind it
        if (this.list) {
            this.list.setCollection(mockCollection);
        }
    }
}

module.exports = MainController;
