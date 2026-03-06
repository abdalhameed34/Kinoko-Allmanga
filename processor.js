// processor.js
// Processor will be used in two satuations
//   1. Load manga pictures.
//   2. Detect if a manga has new chapter.  
class MangaProcesser extends Processor {
    // The unique identifier for detecting which manga chapter is processing on.
    get key();

    /**
     * Save the loading state, could be called in `load` method.
     *
     * @param {bool} complete, determie the loading complete or not.
     * @param {*} state, for `load` restart. 
     */
    save(complete, state);

    /**
     * Start load pictures, need override
     * 
     * @param {*} state The saved state.
     * @return Promise 
     */
    load(state);

     // Called in `dispose`, need override
    unload();

    /**
     * Check for new chapter, need override
     * 
     * @return Promise<{title, key}> The information of last chapter 
     */
    checkNew();

    /**
     * After getting the picture information, set the picture data than
     * it will be shown. 
     * @param data.url {String} The picture url
     * @param data.headers {Object} Optional, The picture http headers.
     * @param list {List} A list ot picture information.
     */ 
    setDataAt(data);
    setData(list);
}
module.exports = MangaProcesser;
