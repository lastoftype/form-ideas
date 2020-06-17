import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import * as yup from "yup";

const recursiveInsert = (
  errorObj: any,
  { path, message }: { path: string; message: string }
): any => {
  if (!path) return message;
  const [key, ...restPath] = path.split(".");

  return {
    ...errorObj,
    [key]: recursiveInsert(errorObj[key] || {}, {
      path: restPath.join("."),
      message,
    }),
  };
};

export const useForm = <T extends Object = any>(
  schema: yup.ObjectSchema<T>,
  initialValues: T
) => {
  const [isTouched, setTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<T>({
    ...initialValues,
  });

  /**
   * Run validation on form object and set validationErrors
   */
  const validateForm = useCallback(() => {
    try {
      schema.validateSync(form, { abortEarly: false });
      setValidationErrors({});
    } catch (errs) {
      const errors = errs.inner.reduce(recursiveInsert, {});
      setValidationErrors(errors);
    }
  }, [setValidationErrors, schema, form]);

  /**
   * Handle submit action
   */
  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.persist();

      setSubmitted(true);
      validateForm();

      if (Object.keys({ ...validationErrors }).length) {
        return false;
      }
    },
    [validateForm, validationErrors, setSubmitted]
  );

  /**
   * Handle input change
   */
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.persist();
      setTouched(true);

      setForm((prevForm) => {
        const serializedUpdate = recursiveInsert(prevForm, {
          path: `${e.target.name}`,
          message: `${e.target.value}`,
        });
        return {
          ...prevForm,
          ...serializedUpdate,
        };
      });

      if (isSubmitted && Object.keys({ ...validationErrors }).length) {
        validateForm();
      }
    },
    [setForm, setTouched, isSubmitted, validateForm, validationErrors]
  );

  return {
    isTouched,
    setTouched: useCallback(setTouched, []),
    validationErrors,
    setValidationErrors: useCallback(setValidationErrors, []),
    isSubmitted,
    setSubmitted: useCallback(setSubmitted, []),
    form,
    setForm: useCallback(setForm, []),
    validateForm,
    onSubmit,
    onChange,
  };
};
