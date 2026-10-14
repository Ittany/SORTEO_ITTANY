import { useCallback, useRef, useState } from 'react'

export function useForm(initialValues = {}) {
  // useRef guarda el valor inicial UNA sola vez → reset() es estable
  // aunque el padre pase un objeto nuevo en cada render.
  const initialRef = useRef(initialValues)

  const [values, setValues] = useState(initialRef.current)
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }, [])

  const reset = useCallback(() => {
    setValues(initialRef.current)
    setErrors({})
  }, [])

  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  return { values, errors, handleChange, reset, setErrors, setFieldError }
}