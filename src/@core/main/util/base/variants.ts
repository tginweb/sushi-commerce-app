
export default function variants(val: string, schema: Record<string, any>) {
  if (schema[val]) return schema[val]
}
