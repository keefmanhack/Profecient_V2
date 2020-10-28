const { Model } = require("mongoose");

const size = Model => async () => {
     const val = await Model.countDocuments({});
     return val;
}
const findById = Model => async id => {
    if(!id){
        throw new Error("Missing Id to find model");
    }
    return await Model.findById(id);
}

const deleteById = Model => async id => {
    if(!id){
        throw new Error("Missing Id to delete model");
    }
    return await Model.findByIdAndRemove(id);
}

const findMultipleById = Model => async ids => {
    if(!ids){
        return;
    }
    return await Model.find({_id: ids});
}

const create = Model => async data => {
    const newModel = new Model(data);
    return await newModel.save();
}

const update = Model => async (id, data) =>{
	if(!id || !data){
		throw new Error("No data or id supplied to update model");
	}
	return await Model.findByIdAndUpdate(id, data);
}


module.exports = {
    size: size,
    findById: findById,
    deleteById: deleteById,
    findMultipleById: findMultipleById,
    create: create,
    update: update,
};