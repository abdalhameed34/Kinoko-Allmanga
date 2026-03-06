class Collection extends glib.Collection {

    constructor(data) {
        super(data);
        this.url = data.url || data.link;
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            console.log("start request " + url);
            let req = glib.Request.new('GET', url);
            
            // Kept your User-Agent headers, they are good for bypassing basic bot checks
            req.setHeader('User-Agent', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Mobile Safari/537.36');
            req.setHeader('Accept-Language', 'en-US,en;q=0.9');
            
            this.callback = glib.Callback.fromFunction(function() {
                if (req.getError()) {
                    reject(glib.Error.new(302, "Request error " + req.getError()));
                } else {
                    let body = req.getResponseBody();
                    if (body) {console.log("RAW HTML START: \n" + body.substring(0, 500) + "\nRAW HTML END"); 
    
    resolve(glib.GumboNode.parse(body));
}
                        console.log("request complete!");
                        resolve(glib.GumboNode.parse(body));
                    } else {
                        reject(glib.Error.new(301, "Response null body"));
                    }
                }
            });
            req.setOnComplete(this.callback);
            req.start();
        });
    }
}

class ParsedCollection extends Collection {
    async fetch(url) {
        let doc = await super.fetch(url);
        let purl = new PageURL(url); // Helper to resolve relative URLs
        
        // Target AllManga's grid/list items. We use a few fallbacks to be safe.
        let nodes = doc.querySelectorAll('.manga-card, .series-list .item, div[class*="manga-item"], .card');
        let results = [];
