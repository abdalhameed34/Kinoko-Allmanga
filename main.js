class MockCollection extends glib.Collection {
    constructor(data) {
        super(data);
    }

    reload(_, cb) {
        let item = glib.DataItem.new();
        item.title = "THE DATA BINDING WORKS!";
        
        this.setData([item]);
        cb();
        return true;
    }
}

class MainController extends Controller {
    load(data) {
        // Find the list (which should work now that it's inside a column)
        this.list = this.findElement('manga_list');
        
        this.collection = new MockCollection(data);
        
        if (this.list) {
            this.list.setCollection(this.collection);
        }
    }
}

module.exports = MainController;
