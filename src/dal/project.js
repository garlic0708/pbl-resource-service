import "../connection/mongo-connection"
import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
    name: String,
    users: {type: [{username: String, role: String}], index: true},
});

const Project = mongoose.Model('Project', ProjectSchema);

