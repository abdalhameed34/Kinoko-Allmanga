class MangaProcesser extends Processor {
    get key() {
        return this._key;
    }

    set key(val) {
        this._key = val;
    }

    save(complete, state) {
        this._complete = complete;
        this._state = state;
    }

    async load(state) {
        try {
            // Note: You will need to replace this with the exact route for reading a chapter
            const url = `https://allmanga.to/read/${this.key}`; 
            
            // Fetch the chapter page HTML
            const response = await fetch(url);
            const html = await response.text();
            
            // Extract image URLs using a regex tailored to AllManga's DOM structure
            // Example: <img class="chapter-img" src="https://example.com/page1.jpg" />
            const imgRegex = /<img[^>]+src="([^">]+)"/ig; 
            let match;
            let pictureList = [];
            
            while ((match = imgRegex.exec(html)) !== null) {
                pictureList.push({
                    url: match[1],
                    // Referer is often required to bypass image hotlink protection
                    headers: { "Referer": "https://allmanga.to" } 
                });
            }

            if (pictureList.length > 0) {
                this.setData(pictureList);
                this.save(true, null);
            } else {
                throw new Error("No images found. AllManga might require HeadlessWebView to evaluate JS.");
            }

        } catch (error) {
            console.log(`[MangaProcesser] Load Error: ${error}`);
            this.save(false, state);
        }
    }

    unload() {
        // Clean up resources if necessary
    }

    async checkNew() {
        try {
            // Fetch the manga's main details page to find the latest chapter release
            const url = `https://allmanga.to/manga/${this.key}`;
            const response = await fetch(url);
            const html = await response.text();
            
            // Example regex to find the latest chapter link and title
            const latestChapterRegex = /<a[^>]+href="[^"]+\/chapter-([^"]+)"[^>]*>(Chapter [^<]+)<\/a>/i;
            const match = latestChapterRegex.exec(html);
            
            if (match) {
                return {
                    key: match[1],   // The unique chapter ID used to load the chapter later
                    title: match[2]  // The readable title (e.g., "Chapter 105")
                };
            }
            return null;
        } catch (error) {
            console.log(`[MangaProcesser] CheckNew Error: ${error}`);
            return null;
        }
    }
}

module.exports = MangaProcesser;
