class ParsedCollection extends Collection {
    
    async fetch(url) {
        let doc = await super.fetch(url);
        let purl = new PageURL(url);
        
        let nodes = doc.querySelectorAll('.manga-card, .series-list .item, div[class*="manga-item"], .card');
        let results = [];
        
        for (let node of nodes) {
            let item = glib.DataItem.new();
            item.type = glib.DataItem.Type.Book;
            
            let linkNode = node.querySelector('.title a, h3 a, .manga-name a') || node.querySelector('a');
            if (!linkNode) continue; 
            
            item.link = purl.href(linkNode.attr('href'));
            
            let titleNode = node.querySelector('.title, h3, h4, .manga-name') || linkNode;
            item.title = titleNode.text.trim();
            
            let subNode = node.querySelector('.chapter a, .latest-chapter, .ep, .status');
            if (subNode) {
                item.subtitle = subNode.text.trim();
            }
            
            results.push(item);
        }
        return results;
    }

    // NEW: The reload function explicitly tells Kinoko to draw the items
    reload(_, cb) {
        this.fetch(this.url).then((results) => {
            
            // If the scraper found absolutely nothing, inject a fake diagnostic item
            if (results.length === 0) {
                let debugItem = glib.DataItem.new();
                debugItem.title = "DEBUG: No manga found!";
                debugItem.subtitle = "The HTML loaded, but the CSS selectors didn't match anything.";
                results.push(debugItem);
            }
            
            this.setData(results);
            cb.apply(null); // Tells the UI the loading is finished
            
        }).catch((err) => {
            
            // If the network or Cloudflare failed entirely, show the error on screen
            let errItem = glib.DataItem.new();
            errItem.title = "DEBUG ERROR:";
            errItem.subtitle = err.message || "Unknown Network Error";
            
            this.setData([errItem]);
            cb.apply(null); 
        });
        
        return true;
    }
}
