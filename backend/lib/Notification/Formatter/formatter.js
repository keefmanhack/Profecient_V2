class Formatter{
    static async format(itemsToFormat, formatMap){
        let formatedItems = [];
        for(let i =0; i<itemsToFormat.list.length; i++){
            const item = itemsToFormat.list[i];
            const formatFunction = formatMap.get(item.onModel);
            formatedItems = formatedItems.concat(await formatFunction(item.to));
        }
        return formatedItems;
    }
}

module.exports = Formatter;