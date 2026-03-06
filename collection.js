class Collection extends glib.Collection {

    constructor(data) {
        super(data);
        this.url = data.url || data.link;
        // 1. Declare the webview at the class level to prevent Garbage Collection
        this.webview = null; 
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            console.log("Starting HeadlessWebView bypass for: " + url);
            
            // 2. Check if HeadlessWebView actually exists in this version of Kinoko
            if (typeof HeadlessWebView === 'undefined') {
                reject(glib.Error.new(305, "HeadlessWebView requires Kinoko v4.1.0+"));
                return;
            }

            // 3. Assign to 'this' to keep the native memory reference alive
            this.webview = new HeadlessWebView();

            this.webview.onloadend = async (currentUrl) => {
                try {
                    let html = await this.webview.eval("document.querySelector('html').outerHTML");
                    
                    if (html && !html.includes('cloudflare-challenge')) {
                        resolve(glib.GumboNode.parse(html));
                    } else {
                        reject(glib.Error.new(301, "Stuck on Cloudflare."));
                    }
                } catch (e) {
                    reject(glib.Error.new(302, "Eval error: " + e.message));
                }
            };

            this.webview.onfail = (failedUrl, error) => {
                reject(glib.Error.new(302, "WebView failed: " + error));
            };

            this.webview.load(url);
        });
    }
}
