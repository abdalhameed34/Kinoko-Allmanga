class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "AllManga",
                    "id": "latest",
                    "url": "https://allmanga.to/search-manga?cty=ALL"
                }
            ]
        };
    }
}
module.exports = IndexController;
