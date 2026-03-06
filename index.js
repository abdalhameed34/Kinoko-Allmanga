class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "AllManga",
                    "id": "home",
                    "url": "https://allmanga.to/manga?cty=ALL"
                }
            ]
        };
    }
}
module.exports = IndexController;
