import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['DEBIT', 'CREDIT']
    },
    reason: {
        type: String,
        enum: ['ENTRY_FEE', 'REFUND', 'PRIZE', 'BONUS'],
        required: true
    },
    contestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest'
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    balanceAfter: {
        type: Number,
        required: true
    },
    meta: {
        type: Object
    }
}, { timestamps: true});

transactionSchema.index({ userId: 1, createdAt: -1 });

export default Transaction = mongoose.model("Transaction", transactionSchema);

