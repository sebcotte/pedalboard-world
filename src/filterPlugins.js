export default function filterPlugins(searchText, pluginsList) {
    return pluginsList.filter(
        (item) => {
            if( item.details[0].name.toLowerCase().includes(searchText.toLowerCase()) ){
                return true;
            }
            return false;
        });
}