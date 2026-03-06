class Collection extends glib.Collection {

    constructor(data) {
        super(data);
        this.url = data.url || data.link;
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            let req = glib.Request.new('GET', url);
            req.setHeader('User-Agent', 'Mozilla/5.0 (Linux; Android 10; SM-G981B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.162 Mobile Safari/537.36');
            
            this.callback = glib.Callback.fromFunction(function() {
                if (req.getError()) {
                    reject(glib.Error.new(302, "Request error " + req.getError()));
                } else {
                    let body = req.getResponseBody();
                    if (body) {
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
