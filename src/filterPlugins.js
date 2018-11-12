export function filterPlugins(searchText, pluginsList) {
    return pluginsList.filter(
        (item) => {
            if( item.details[0].name.toLowerCase().includes(searchText.toLowerCase()) ){
                return true;
            }
            return false;
        });
}

export function filterPluginsByTag(searchedTag, pluginsList) {
    return pluginsList.filter(
        (item) => {
            if( item.tags.toLowerCase().includes(searchedTag.toLowerCase()) ){
                return true;
            }
            return false;
        });
}