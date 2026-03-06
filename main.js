class MainController extends Controller {
    
    load(data) {
        // 1. Find the list
        this.list = this.findElement('manga_list');
        
        // 2. Create a fake collection directly inside this file
        let mockCollection = glib.Collection.new();
        
        // 3. Override the reload function to instantly provide fake data
        mockCollection.reload = function(_, cb) {
            let item = glib.DataItem.new();
            item.title = "IT FINALLY WORKS!";
            item.subtitle = "The UI is rendering perfectly.";
            
            this.setData([item]);
            cb.apply(null);
            return true;
        };
        
        // 4. Bind it to the list
        this.list.setCollection(mockCollection);
    }
}

module.exports = MainController;
