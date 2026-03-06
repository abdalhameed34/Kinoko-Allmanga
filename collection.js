class Collection extends glib.Collection {

    constructor(data) {
        super(data);
        this.url = data.url || data.link;
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            console.log("Starting HeadlessWebView bypass for: " + url);
            
            // 1. Spin up the invisible browser
            let webview = new HeadlessWebView();

            // 2. What to do when the page finishes loading
            webview.onloadend = async (currentUrl) => {
                console.log(`[HeadlessWebView] loadEnd: ${currentUrl}`);
                
                try {
                    // Extract the fully rendered HTML *after* Cloudflare lets us in
                    let html = await webview.eval("document.querySelector('html').outerHTML");
                    
                    // Optional: Get the clearance cookies just in case we need them for images later
                    let cookies = await webview.getCookies(url);
                    console.log("[HeadlessWebView] Cloudflare Cookies obtained: ", JSON.stringify(cookies));
                    
                    if (html && !html.includes('cloudflare-challenge')) {
                        console.log("Cloudflare bypassed successfully!");
                        // Parse the real HTML and send it to your scraper
                        resolve(glib.GumboNode.parse(html));
                    } else {
                        reject(glib.Error.new(301, "Still stuck on Cloudflare challenge page."));
                    }
                } catch (e) {
                    reject(glib.Error.new(302, "Failed to extract HTML: " + e.message));
                }
            };

            // 3. What to do if the connection outright fails
            webview.onfail = (failedUrl, error) => {
                console.log(`[HeadlessWebView] loadFailed: ${failedUrl} | Error: ${error}`);
                reject(glib.Error.new(302, "WebView failed to load: " + error));
            };

            // 4. Start the engine and load the target URL
            webview.load(url);
        });
    }
}
