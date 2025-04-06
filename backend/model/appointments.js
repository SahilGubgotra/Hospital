const mongoose = require('mongoose');

const appintments_schema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true,
    },
    payment:{
        type:String,
        enum: ['paid', 'unpaid'],
        default:'unpaid'
    },
    paymentDate: {
        type: Date
    },
    paymentAmount: {
        type: Number
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'other'],
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled', 'unchecked'],
        default: "unchecked",
    },
    invoice: {
        type: String,
        require: true,
    },
    disease: {
        type: String,
        default: "Healthy",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    about:{
        type:String,
    },
    medicine:{
        type:[String]
    },
    dosage: {
        type: [String]
    },
    duration: {
        type: [String]
    },
    instructions: {
        type: [String]
    },
    followUpRequired: {
        type: Boolean,
        default: false
    },
    followUpDate: {
        type: Date
    }
}, {
    timestamps: true
});


const appointments = mongoose.model("appointments", appintments_schema);
module.exports = appointments;