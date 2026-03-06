class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "UI Test",
                    "id": "test",
                    "url": "https://allmanga.to/manga?cty=ALL"
                }
            ]
        };
    }
}
module.exports = IndexController;
