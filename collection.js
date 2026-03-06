class Collection extends glib.Collection {

    constructor(data) {
        super(data);
        this.url = data.url || data.link;
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            let req = glib.Request.new('GET', url);
            
            // Your exact Chrome User-Agent
            req.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36');
            
            // Your exact Analytics Cookie
            req.setHeader('Cookie', '_ga_7W9XQ7WXTT=GS2.1.s1772765508$o1$g0$t1772765508$j60$l0$h0; _ga=GA1.1.1488643243.1772765508');
            
            this.callback = glib.Callback.fromFunction(function() {
                if (req.getError()) {
                    reject(glib.Error.new(302, "Request error " + req.getError()));
                } else {
                    let body = req.getResponseBody();
                    if (body && !body.includes('cloudflare-challenge') && !body.includes('Just a moment')) {
                        // Success! Cloudflare let us in.
                        resolve(glib.GumboNode.parse(body));
                    } else {
                        // Cloudflare rejected the disguise.
                        reject(glib.Error.new(301, "Cloudflare rejected the stolen cookies."));
                    }
                }
            });
            req.setOnComplete(this.callback);
            req.start();
        });
    }
}
