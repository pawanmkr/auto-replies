import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    reply: {
        type: [String],
        default: [
            "Hey, This is an automated reply!"
        ]
    },
    replied_total: {
        type: Number,
        default: 33
    }
});

export default mongoose.model('User', userSchema);
