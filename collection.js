class Collection extends glib.Collection {
    constructor(data) {
        super(data);
        this.url = data.url || data.link;
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            let req = glib.Request.new('GET', url);
            
            // The injected VIP pass
            req.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
            req.setHeader('Cookie', '_ga_7W9XQ7WXTT=GS2.1.s1772765508$o1$g0$t1772765508$j60$l0$h0; _ga=GA1.1.1488643243.1772765508');
            
            this.callback = glib.Callback.fromFunction(function() {
                if (req.getError()) {
                    reject(glib.Error.new(302, "Request error: " + req.getError()));
                } else {
                    let body = req.getResponseBody();
                    if (body && !body.includes('cloudflare-challenge') && !body.includes('Just a moment')) {
                        resolve(glib.GumboNode.parse(body));
                    } else {
                        reject(glib.Error.new(301, "Cloudflare rejected the injected cookies."));
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
        
        let nodes = doc.querySelectorAll('.manga-card, .series-list .item, div[class*="manga-item"], .card');
        let results = [];
        
        for (let node of nodes) {
            let item = glib.DataItem.new();
            item.type = glib.DataItem.Type.Book;
            
            let linkNode = node.querySelector('a');
            if (linkNode) {
                item.link = linkNode.attr('href');
            }
            
            let titleNode = node.querySelector('.title, h3, h4, .manga-name') || linkNode;
            if (titleNode) {
                item.title = titleNode.text.trim();
            }
            
            let imgNode = node.querySelector('img');
            if (imgNode) {
                item.picture = imgNode.attr('src') || imgNode.attr('data-src');
            } else {
                // Safe fallback image so the UI doesn't collapse
                item.picture = "https://via.placeholder.com/80x110/cccccc/000000?text=No+Cover";
            }
            
            results.push(item);
        }
        return results;
    }

    reload(_, cb) {
        this.fetch(this.url).then((results) => {
            // If the scraper survived but found no items, show a diagnostic card
            if (results.length === 0) {
                let debugItem = glib.DataItem.new();
                debugItem.title = "HTML Loaded successfully!";
                debugItem.subtitle = "Cloudflare bypassed, but 0 manga covers found. The CSS tags might have changed.";
                debugItem.picture = "https://via.placeholder.com/80x110/00ff00/000000?text=0+Items";
                results.push(debugItem);
            }
            this.setData(results);
            cb.apply(null);
        }).catch((err) => {
            // If Cloudflare blocks us or the network fails, show an error card
            let errItem = glib.DataItem.new();
            errItem.title = "NETWORK ERROR";
            errItem.subtitle = err.message || "Failed to load the website.";
            errItem.picture = "https://via.placeholder.com/80x110/ff0000/ffffff?text=Error";
            this.setData([errItem]);
            cb.apply(null);
        });
        return true;
    }
}

// Critical: Exporting both classes so main.js can actually see them
module.exports = {
    Collection: Collection,
    ParsedCollection: ParsedCollection
};
