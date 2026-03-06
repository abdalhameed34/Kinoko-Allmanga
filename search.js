const {ParsedCollection} = require('./collection');

class SearchCollection extends ParsedCollection {
    
    constructor(data) {
        super(data);
    }

    makeURL() {
        // This will take the search URL you define in your configuration 
        // (e.g., "https://allmanga.to/search-manga?q={1}") 
        // and safely inject the user's search query into the {1} placeholder.
        return this.url.replace('{1}', glib.Encoder.urlEncode(this.key));
    }

    reload(data, cb) {
        this.key = data.get("key") || this.key;
        if (!this.key) return false;
        
        this.fetch(this.makeURL()).then((results) => {
            this.setData(results);
            cb.apply(null);
        }).catch(function(err) {
            if (err instanceof Error) 
                err = glib.Error.new(305, err.message);
            cb.apply(err);
        });
        return true;
    } 
}

module.exports = function(data) {
    return SearchCollection.new(data ? data.toObject() : {});
};
