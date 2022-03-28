import React, {useState, useContext} from "react";
import axios from "axios";
import {UserContext} from "../context/UserContext";
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password} from 'primereact/password';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

  function Register() {

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const defaultValues = {
        name: '',
        username: '',        
        password: '',
        address: '',
        mobile: '',
        group: 'customer'
    }

   const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const getFormErrorMessage = (name) => {
       return errors[name] && <small className="p-error">{errors[name].message}</small>
   };
   const passwordHeader = <h6>Pick a password</h6>;
   const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    const [userContext, setUserContext] = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showError, setShowError] = useState(false);

    const onSubmit = (data) => {

        setFormData(data);
        setShowMessage(true);
        registerUser(data);
        
    };

    async function registerUser(newUser) {
      setIsSubmitting(true);
      try {
        console.log(newUser);
        const res = await axios.post(process.env.REACT_APP_API_ENDPOINT + "user/register", newUser)
        const data = res.data;
        setUserContext( (prev) => {
          return {...prev, token: data.token, detail: data}
        });
        reset();
      } catch (err) {
        console.log(err);
      }     
    }
    
  return (

      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
              <span className="p-float-label">
                  <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                      <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                              )} />
                      <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
              </span>
              {getFormErrorMessage('name')}
          </div>
          <div className="field">
                <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                        <Controller name="username" control={control}
                            rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }}}
                            render={({ field, fieldState }) => (
                                <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                      <label htmlFor="username" className={classNames({ 'p-error': !!errors.username })}>Username*</label>
                </span>
                            {getFormErrorMessage('username')}
          </div>
          <div className="field">
                <span className="p-float-label">
                        <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                            <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                )} />
                      <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                </span>
                            {getFormErrorMessage('password')}
          </div>
          <div className="field">
                <span className="p-float-label">
                        <Controller name="mobile" control={control} rules={{ required: 'mobile contact is required.' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                      <label htmlFor="mobile" >Mobile*</label>
                </span>
          </div>
          <div className="field">
                <span className="p-float-label">
                        <Controller name="address" control={control}  render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                      <label htmlFor="address" >Address</label>
                </span>
          </div>
          <Button type="submit" label="Submit" className="mt-2" />
        </form>

  )
}

export default Register;
