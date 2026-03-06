class BookCollection extends glib.Collection {

    constructor(data) {
        super();
        this.url = data.link;
    }

    initialize() {
        this.temp = "temp.xml";
    }

    fetch(url) {
        return new Promise((resolve, reject) => {
            let req = glib.Request.new('GET', url);
            this.callback = glib.Callback.fromFunction(function() {
                if (req.getError()) {
                    reject(glib.Error.new(302, "Request error " + req.getError()));
                } else {
                    let body = req.getResponseBody();
                    if (body) {
                        // Parses the raw HTML string into a DOM tree
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

    reload(_, cb) {
        let purl = new PageURL(this.url);
        let info_data = this.info_data;
        
        this.fetch(this.url).then((doc) => {
            // 1. Extract Cover Image
            // Adjusted selectors to target common manga site image wrappers
            let coverImg = doc.querySelector('.manga-info img') || doc.querySelector('.thumb img') || doc.querySelector('img');
            if (coverImg) {
                info_data.picture = coverImg.attr('src') || coverImg.attr('data-src');
            }

            // 2. Extract Title and Subtitle
            let titles = doc.querySelectorAll('h1, h2.title');
            try {
                if (titles.length > 0) info_data.title = titles[0].text.trim();
                if (titles.length > 1) info_data.subtitle = titles[1].text.trim();
            } catch (e) {
                console.log("Error parsing titles: " + e.message);
            }

            // 3. Extract Tags / Genres
            // Targets common tag containers on manga sites
            let tags = doc.querySelectorAll('.genres a, .tags a, .manga-tags a');
            let links = [];
            for (let i = 0, t = tags.length; i < t; i++) {
                let tag = tags[i];
                try {
                    links.push({
                        link: purl.href(tag.attr('href')),
                        name: tag.text.trim(),
                        count: '-'
                    });
                } catch (e) {
                    console.log("Error parsing tag: " + e.message);
                }
            }
            
            let dataTags = [];
            if (links.length > 0) {
                dataTags.push({
                    title: "Genres",
                    links: links
                });
            }

            // 4. Extract Chapter List
            // Instead of pulling images, we pull the chapter links to create multiple DataItems
            let chapterNodes = doc.querySelectorAll('.chapter-list a, .chapters-wrapper a, .episodes-list a');
            let chapters = [];
            
            for (let i = 0, t = chapterNodes.length; i < t; i++) {
                let node = chapterNodes[i];
                let item = glib.DataItem.new();
                
                item.type = glib.DataItem.Type.Chapter;
                item.link = purl.href(node.attr('href'));
                
                // Usually the chapter title or number is inside the link text or a specific span
                let chapTitleNode = node.querySelector('.chapter-name') || node; 
                item.title = chapTitleNode.text.trim();
                
                chapters.push(item);
            }

            // Depending on how AllManga sorts chapters, you may need to uncomment the line below 
            // if the chapters show up from oldest-to-newest but your reader expects newest-to-oldest.
            // chapters.reverse();

            info_data.data = {
                tags: dataTags
            };
            
            // Set the full array of chapter items
            this.setData(chapters);
            cb.apply(null);
