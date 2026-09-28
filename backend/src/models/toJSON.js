// Shared plugin: expose `id` instead of `_id`/`__v` in every API response.
export default function cleanJSON(schema) {
  schema.set("toJSON", {
    virtuals: false,
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  });
}
