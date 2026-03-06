class IndexController extends Controller {
    load() {
        this.data = {
            tabs: [
                {
                    "title": "All Manga",
                    "id": "all",
                    "url": "https://allmanga.to/manga?cty=ALL"
                }, 
                {
                    "title": "Latest Updates",
                    "id": "latest",
                    "url": "https://allmanga.to/search-manga?cty=ALL"
                }
            ]
        };
    }

    unload() {
        // Optional cleanup when the index view is closed
    }
}

module.exports = IndexController;
