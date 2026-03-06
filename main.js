class MainController extends Controller {
    load(data) {
        // 1. Find the list
        this.list = this.findElement('manga_list');
        
        // 2. Create an offline, fake collection
        let mockCollection = glib.Collection.new();
        
        mockCollection.reload = function(_, cb) {
            let item = glib.DataItem.new();
            item.title = "THE UI IS SAFE!";
            item.subtitle = "The HeadlessWebView is the killer.";
            // A safe, standard test image
            item.picture = "https://via.placeholder.com/80x110"; 
            
            this.setData([item]);
            cb.apply(null);
            return true;
        };
        
        // 3. Bind the safe data to the UI
        if (this.list) {
            this.list.setCollection(mockCollection);
        }
    }
}

module.exports = MainController;
