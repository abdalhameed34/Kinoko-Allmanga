class MainController extends Controller {
    load(data) {
        this.list = this.findElement('manga_list');
        
        let mockCollection = glib.Collection.new();
        mockCollection.reload = function(_, cb) {
            let item = glib.DataItem.new();
            item.title = "THE WIDGET BRIDGE IS ALIVE!";
            
            this.setData([item]);
            cb.apply(null);
            return true;
        };
        
        if (this.list) {
            this.list.setCollection(mockCollection);
        }
    }
}
module.exports = MainController;
