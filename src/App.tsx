import React, { useState } from "react";
import * as yup from "yup";
import { $enum } from "ts-enum-util";

import { TruckerContainer } from "./FormContainer";
import { IUser, ITrucker, USER_TYPE } from "./models";

const userSchema = yup
  .object<IUser>({
    firstName: yup.string().required("This is required."),
    lastName: yup.string().required("This is required."),
    email: yup
      .string()
      .email()
      .when("userType", {
        is: USER_TYPE.customer,
        then: yup.string().email().required("This field is required"),
        otherwise: yup.string().email(),
      }),
    userType: yup
      .mixed()
      .oneOf([...$enum(USER_TYPE).getValues()], "Must be a valid choice")
      .nullable()
      .required("This is required"),
  })
  .required();

const formSchema = yup
  .object<ITrucker>({
    id: yup.string(),
    user: userSchema,
  })
  .required();

const defaultState: ITrucker = {
  user: {
    firstName: "",
    lastName: "",
    email: "",
    userType: null,
  },
};

function App() {
  const [initialValues] = useState<ITrucker>(defaultState);

  return (
    <div className="App">
      <TruckerContainer schema={formSchema} initialValues={initialValues}>
        {({ validationErrors, form, onChange, onSubmit }) => (
          <form onSubmit={onSubmit}>
            <pre>{JSON.stringify(validationErrors, undefined, " ")}</pre>
            <div>
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
              <div></div>

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
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="user.email"
                value={form?.user?.email}
                onChange={onChange}
              />
              {validationErrors?.user?.email && (
                <div>{validationErrors.user?.email}</div>
              )}
            </div>

            <select name="user.userType" onChange={onChange}>
              {[...$enum(USER_TYPE).getEntries(), ["other", "other"]].map(
                ([key, val]) => (
                  <option value={val} key={val}>
                    {key}
                  </option>
                )
              )}
            </select>

            <button type="submit">Submit</button>
          </form>
        )}
      </TruckerContainer>
    </div>
  );
}

export default App;
