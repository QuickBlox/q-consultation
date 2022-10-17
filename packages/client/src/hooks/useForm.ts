import { useRef, useState, FormEvent, ChangeEvent, FocusEvent } from 'react'
import _set from 'lodash/set'
import _get from 'lodash/get'

const isTouched = (value: Primitive) => {
  if (typeof value === 'boolean') return true

  return Boolean(value)
}

export const transformObjectTails = <T, R extends Primitive>(
  value: T,
  transform: (value: Primitive) => R,
) => {
  if (!value) return {} as SetTails<T, R>

  if (Array.isArray(value)) {
    const list: unknown[] = []

    value.forEach((item) => {
      const currentValue =
        item && typeof item === 'object'
          ? transformObjectTails(item, transform)
          : transform(item)

      list.push(currentValue)
    })

    return list as SetTails<T, R>
  }

  const data: Dictionary<unknown> = {}

  Object.entries(value).forEach(([key, item]) => {
    const currentValue =
      item && typeof item === 'object'
        ? transformObjectTails(item, transform)
        : transform(item)

    data[key] = currentValue
  })

  return data as SetTails<T, R>
}

interface UseForm<T, E> {
  initialValues: T
  onSubmit?: (values: T) => void
  validate?: (values: T) => Partial<E>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function useForm<T extends object, E extends object>(
  data: UseForm<T, E>,
) {
  const initialValuesRef = useRef(data.initialValues)
  const { current: initialValues } = initialValuesRef
  const [values, setValue] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<E>>(
    data.validate ? data.validate(initialValues) : {},
  )

  const initialTouched = transformObjectTails(initialValues, isTouched)
  const [touched, setTouched] = useState(initialTouched)

  const setFieldValue = (
    nameOrPath: string,
    value: unknown,
    shouldValidate = true,
  ) => {
    if (_get(values, nameOrPath) === undefined || typeof value === 'object') {
      setTouched({
        ..._set<SetTails<T, boolean>>(
          touched,
          nameOrPath,
          value && typeof value === 'object'
            ? transformObjectTails(value, isTouched)
            : false,
        ),
      })
    }

    const newValues = { ..._set<T>(values, nameOrPath, value) }

    setValue(newValues)

    if (shouldValidate && data.validate) {
      setErrors(data.validate(newValues))
    }
  }

  const setFieldTouched = (nameOrPath: string) => {
    setTouched({ ..._set(touched, nameOrPath, true) })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorFields = Object.keys(errors)

    setTouched(transformObjectTails(values, () => true))

    if (!errorFields.length) {
      data?.onSubmit?.(values)
      initialValuesRef.current = values
    }
  }

  const handleChange = ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target: { name: nameOrPath, type, value, checked },
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === 'checkbox' && typeof checked === 'boolean') {
      setFieldValue(nameOrPath, checked)
    } else {
      setFieldValue(nameOrPath, value)
    }
  }

  const handleBlur = ({
    target,
  }: FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | string
  >) => {
    const nameOrPath = target instanceof Element ? target.name : undefined

    if (nameOrPath) {
      setFieldTouched(nameOrPath)
    }
  }

  const resetForm = () => {
    setValue(initialValues)
    setErrors(data.validate ? data.validate(initialValues) : {})
    setTouched(initialTouched)
  }

  const reinitialize = () => {
    initialValuesRef.current = data.initialValues
    setValue(data.initialValues)
    setErrors(data.validate ? data.validate(data.initialValues) : {})
    setTouched(transformObjectTails(data.initialValues, isTouched))
  }

  return {
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    resetForm,
    reinitialize,
    touched,
    values,
  }
}
