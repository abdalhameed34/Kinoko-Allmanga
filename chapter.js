const {Collection} = require('./collection');

class ChapterCollection extends Collection {

    async request(url) {
        // We only need to fetch the single chapter URL 
        let doc = await this.fetch(url);
        this.parseDoc(doc, url);
    }

    parseDoc(doc, root_url) {
        // Target common manga reader image containers. 
        // AllManga uses dynamic classes, so we use a few common fallbacks.
        let imgs = doc.querySelectorAll('.chapter-content img, .reading-content img, #page-array img, div[class*="reader"] img');
        
        // If the specific wrapper isn't found, fallback to grabbing all images 
        if (imgs.length === 0) {
             imgs = doc.querySelectorAll('img'); 
        }

        let validImageCount = 0;

        for (let i = 0, t = imgs.length; i < t; ++i) {
            let img = imgs[i];
            
            // Modern sites often use 'data-src' to lazy-load images as you scroll down
            let src = img.attr('data-src') || img.attr('src');
            
            // Filter out UI elements, logos, and blank tracking pixels
            if (!src || src.includes('logo') || src.includes('avatar') || src.includes('gif')) {
                continue; 
            }

            let item = glib.DataItem.new();
            
            // Ensure the URL is absolute
            if (src.startsWith('//')) {
                item.picture = 'https:' + src;
            } else if (src.startsWith('/')) {
                item.picture = 'https://allmanga.to' + src;
            } else {
                item.picture = src;
            }

            item.link = root_url; 
            
            // Insert the image into the Kinoko reader at the correct index
            this.setDataAt(item, validImageCount);
            console.log("Parsed Image " + validImageCount + ": " + item.picture);
            
            validImageCount++;
        }
        
        return validImageCount;
    }

    reload(_, cb) {
        let url = this.info_data.link;
        this.request(url).then(() => {
            cb.apply(null);
        }).catch((err) => {
            if (err instanceof Error) 
                err = glib.Error.new(305, err.message);
            console.error("Chapter load error: " + err.message);
            cb.apply(err);
        });
        return true;
    }
}

module.exports = function (data) {
    return ChapterCollection.new(data);
};
