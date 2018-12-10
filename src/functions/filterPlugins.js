export function filterPlugins(searchText, pluginsList) {
    return pluginsList.filter(
        (item) => {
            if( item.name.toLowerCase().includes(searchText.toLowerCase()) ){
                return true;
            }
            return false;
        });
}

export function filterPluginsByTag(searchedTag, pluginsList, pluginsPerPage) {
    if (searchedTag === '') return pluginsList.slice(0,pluginsPerPage)
    return pluginsList.filter(
        (item) => {
            if (item.tags.includes(searchedTag)) {
                return true
            }
            return false;
        });
}