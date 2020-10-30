class Formatter{
    static async format(itemsToFormat, formatMap, currUserID){
        let formatedItems = [];
        for(let i =0; i<itemsToFormat.list.length; i++){
            const item = itemsToFormat.list[i];
            const formatFunction = formatMap.get(item.onModel);
            formatedItems = formatedItems.concat(await formatFunction(item.to, currUserID));
        }
        return formatedItems;
    }
}

module.exports = Formatter;