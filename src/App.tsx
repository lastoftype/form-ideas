import React, {
  FC,
  useState,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import * as yup from "yup";

interface IUser {
  firstName: string;
}

const formSchema = yup.object<IUser>({
  firstName: yup.string().email().required(),
});

interface IFormContainerProps {
  initialValues: {
    [key: string]: any;
  };
  children: (args: {
    isTouched: boolean;
    validationErrors: any;
    isSubmitted: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    form: any;
  }) => any;
  schema: yup.Schema<any>;
}

const FormContainer: FC<IFormContainerProps> = ({
  children,
  schema,
  initialValues,
}: IFormContainerProps) => {
  const [isTouched, setTouched] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ ...initialValues });

  const validateForm = useCallback(() => {
    try {
      schema.validateSync(form, { abortEarly: false });
      setValidationErrors({});
    } catch (errs) {
      const validationMessages = errs.inner.reduce(
        (
          acc: { [key: string]: string },
          { path, message }: { path: string; message: string }
        ) => {
          acc[path] = message;
          return acc;
        },
        {}
      );
      setValidationErrors(validationMessages);
    }
  }, [setValidationErrors, schema, form]);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      e.persist();

      setSubmitted(true);
      validateForm();

      if (Object.keys(validationErrors).length) {
        return false;
      }
    },
    [validateForm, validationErrors]
  );

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    e.persist();
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  }, []);

  return (
    <div className="FormContainer">
      {children({
        isTouched,
        validationErrors,
        isSubmitted,
        onSubmit,
        onChange,
        form,
      })}
    </div>
  );
};

function App() {
  const [initialValues, setInitialValues] = useState({
    firstName: "John",
  });

  return (
    <div className="App">
      <FormContainer schema={formSchema} initialValues={initialValues}>
        {({
          isTouched,
          validationErrors,
          isSubmitted,
          form,
          onChange,
          onSubmit,
        }) => (
          <form onSubmit={onSubmit}>
            <label htmlFor="firstName">first name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
            />
            {validationErrors?.firstName && (
              <div>{validationErrors.firstName}</div>
            )}
            <button type="submit">Submit</button>
          </form>
        )}
      </FormContainer>
    </div>
  );
}

export default App;
