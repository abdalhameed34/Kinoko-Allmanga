class MockCollection extends glib.Collection {
    constructor(data) {
        super(data);
    }

    reload(_, cb) {
        let item = glib.DataItem.new();
        item.title = "DATA BINDING WORKS!";
        item.subtitle = "The XML layout was the culprit.";
        
        this.setData([item]);
        cb(); // Simplified from cb.apply(null) to be as safe as possible
        return true;
    }
}

class MainController extends Controller {
    load(data) {
        this.list = this.findElement('manga_list');
        this.collection = MockCollection.new(data);
        
        if (this.list) {
            this.list.setCollection(this.collection);
        }
    }
}

module.exports = MainController;
