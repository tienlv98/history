import { Schema, model, Document } from 'mongoose';

// Define your schema structure
const schemaStructure = {
    stringField: { type: String, default: '' },
    numberField: { type: Number, default: 0 },
    booleanField: { type: Boolean, default: false },
};

// Function to create a schema
const createSchema = (name: string, structure: any) => {
    const newSchema = new Schema(structure, { versionKey: false, timestamps: true });
    return model<Document>(name, newSchema);
};

// Create multiple schemas
const Schema1 = createSchema('Schema1', schemaStructure);
const Schema2 = createSchema('Schema2', schemaStructure);
const Schema3 = createSchema('Schema3', schemaStructure);