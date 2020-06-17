import React, { useState } from "react";
import * as yup from "yup";

import { TruckerContainer } from "./FormContainer";
import { IUser, ITrucker } from "./models";

const userSchema = yup
  .object<IUser>({
    firstName: yup.string().email().required("This is required."),
    lastName: yup.string().email().required("This is required."),
  })
  .required();

const formSchema = yup
  .object<ITrucker>({
    id: yup.string(),
    user: userSchema,
  })
  .required();

function App() {
  const [initialValues] = useState<ITrucker>({
    id: "12",
    user: {
      firstName: "John",
      lastName: "Johnson",
    },
  });

  return (
    <div className="App">
      <TruckerContainer schema={formSchema} initialValues={initialValues}>
        {({ validationErrors, form, onChange, onSubmit }) => (
          <form onSubmit={onSubmit}>
            <label htmlFor="firstName">first name</label>
            <input
              type="text"
              name="user.firstName"
              value={form?.user?.firstName}
              onChange={onChange}
            />
            {validationErrors?.user?.firstName && (
              <div>{validationErrors.user?.firstName}</div>
            )}

            <label htmlFor="lastName">last name</label>
            <input
              type="text"
              name="user.lastName"
              value={form?.user?.lastName}
              onChange={onChange}
            />
            {validationErrors?.user?.lastName && (
              <div>{validationErrors.user?.lastName}</div>
            )}

            <button type="submit">Submit</button>
          </form>
        )}
      </TruckerContainer>
    </div>
  );
}

export default App;
