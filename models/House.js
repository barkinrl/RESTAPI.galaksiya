const { Int32 } = require('mongodb');
const mongoose = require('mongoose');



const HouseSchema = mongoose.Schema({
    _id:{
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId
    },
    List_No: {
        type: Number,
        required: true
    },
    Property_Name: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    House_Type: {
        type: String,
        default:"House"
    },
    Area_in_sq_ft: {
        type: Number,
        required: true
    },
    No: {
        Of_Bedrooms: { 
            type: Number
        },
        Of_Bathrooms:{ 
            type: Number    
        },
        Of_Receptions:{ 
            type: Number
        }
    },
    Location: {
        type: String,
        default: ""
    },
    City_County: {
        type: String,
        default:"London"
    },
    Postal_Code: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model("ListOfAll", HouseSchema, "ListOfAll");