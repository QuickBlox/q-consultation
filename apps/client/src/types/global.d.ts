type Writeable<T> = { -readonly [P in keyof T]: T[P] }

type Dictionary<T> = Record<string, T>

type DictionaryByKey<T, V> = {
  [K in keyof T]?: V
}

type Primitive = string | number | boolean | undefined | null | Date | File

type SetTails<T, R extends Primitive> = T extends Array<unknown>
  ? Array<T[number] extends Primitive ? R : SetTails<T[number], R>>
  : {
      [K in keyof T]: T[K] extends Primitive ? R : SetTails<T[K], R>
    }

interface DateRange {
  from: Date
  to: Date
}
