import React, { FormEvent, FC, ChangeEvent } from "react";
import * as yup from "yup";

import { useForm } from "./hooks";
import { IUser, ITrucker } from "./models";

interface IFormContainerProps<T extends Object = any> {
  initialValues: T;
  children: (args: {
    isTouched: boolean;
    validationErrors: yup.InferType<yup.ObjectSchema<T>>;
    isSubmitted: boolean;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    form: T;
  }) => any;
  schema: yup.ObjectSchema<T>;
}

const FormContainer: FC<IFormContainerProps> = ({
  children,
  schema,
  initialValues,
}) => {
  const {
    isTouched,
    validationErrors,
    isSubmitted,
    form,
    onSubmit,
    onChange,
  } = useForm(schema, initialValues);

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

export const UserContainer: FC<IFormContainerProps<IUser>> = FormContainer;
export const TruckerContainer: FC<IFormContainerProps<
  ITrucker
>> = FormContainer;

export default FormContainer;
