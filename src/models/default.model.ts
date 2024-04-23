export const defaultModel = {
  date: { type: Date },
  string: { type: String, default: '' },
  numberUnique: { type: Number, required: true, unique: true },
  stringUnique: { type: String, required: true, unique: true },
  array: { type: Array<any>, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: Object, default: {} },
};
