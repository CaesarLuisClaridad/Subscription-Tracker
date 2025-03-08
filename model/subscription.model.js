import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 1000
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, "Price must not be lower than zero"]
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'PHP'],
        default: 'PHP',
    },
    frequency: {
        type: String,
        enum: [ 'daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports', 'news', 'entertainment', 'lifestype', 'technology', 'finance', 'politices', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }    
}, {timestamps: true})


subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){   // Check if renewalDate is not set
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        }

        this.renewalDate = new Date(this.startDate);  // Set the renewal date based on the start date
        // Add the corresponding number of days based on the subscription frequency
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
    }

    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
    
    next();
})

const Subscription = mongoose.model('Subscription', subscriptionSchema)

export default Subscription;