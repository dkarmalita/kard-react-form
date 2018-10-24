# kard-react-form

@kard-doc

## How to develop

clone & start
```sh
mkdir -p ./packages/@kard
cd $_
git clone https://github.com/dkarmalita/kard-react-form.git
cd kard-react-form
npm start
```
start
```sh
cd ./packages/@kard/kard-react-form
npm start
```

## How to add as a submodule

```sh
git submodule add https://github.com/dkarmalita/kard-react-form.git packages/@kard/kard-react-form
```

## Basics

`kard-react-form` consists of the `FormProvider` component and several HoCs. Three of them (input HoCs) implement different schemes of field connection:

* `asCheckboxField` -  to connect a checkbox field.
* `asInputField` - to connect  text or  password input fields, select and textarea 
* `asRadioButtonField` -to connect radio-buttons.

All of these HoCs are built on top of `asField` which implements the main functionality of the form field.

Also, there is `withFormContext` HoC which allows building different controls with full access to the form's state, like submit or reset buttons, form monitors and so on.

The main purpose of the input HoCs is to provide field-specific events handlers which can be directly used with the corresponding inputs or even just passed to it. 

```jsx
  export const Input = asInputField(( props ) => 
    ( <input {...props} /> )
     
  export const Checkbox = asCheckboxField(( props ) => 
    ( <input {...props} type='checkbox' />, false ))
                                    
  export const RadioButton = asRadioButtonField(( props ) => 
    ( <input {...props} type='radio' /> ))
  
  export const Select = asInputField(( props ) => 
    ( <select {...props} /> ))
     
  export const Textarea = asInputField(( props ) => 
    ( <textarea {...props} /> ))

```

In the case of control creation with  `withFormContext`, it supplies the whole form API to the control, allows to get any part of the control's state.

```jsx
  /**
   * Object Without Property - a helper which returns a copy of 
   * the given object without properties listed in keys param.
   */
  function owp( obj, keys ){
    var target = {}
    for( var i in obj ){
      if( keys.indexOf( i ) >= 0 ) continue
      if( !Object.prototype.hasOwnProperty.call( obj, i )) continue
      target[i] = obj[i]
    }
    return target
  }
  
  export const SubmitButton = withFormContext(( props ) => (
    <button {...owp( props, ['formLink'])} onClick={() => {
      const { getFormValue, getFormState, getFieldsState } = props.formLink
      console.group( 'Submitted' )
      console.log( 'FormValue', getFormValue())
      console.log( 'FormState', getFormState())
      console.log( 'FieldsState', getFieldsState())
      console.groupEnd( 'Submitted' )
    }} />
  ))
  
  export const CancelButton = withFormContext(( props ) => (
    <button {...owp( props, ['formLink'])} onClick={() => props.formLink.resetForm()} />
  ))
```

After the components are defined in such a simple way, we can use them to create a form. Let's just give a name to each field with `fieldName` property and voila - it's working!

```jsx
  <div>
    <FormProvider
    >
      <Input fieldName='input1' />
      <Input fieldName='input2' />
      <Checkbox fieldName='input3' />
      <RadioButton fieldName='input4' option='option A' />
      <RadioButton fieldName='input4' option='option B' />
      <Select fieldName='input5'>
        <option disabled value=''> -- select an option -- </option>
        <option value='volvo'>Volvo</option>
        <option value='saab'>Saab</option>
        <option value='mercedes'>Mercedes</option>
        <option value='audi'>Audi</option>
      </Select>
      <Textarea fieldName='input6' />
      <SubmitButton>Submit</SubmitButton>
      <CancelButton>Cancel</CancelButton>
    </FormProvider>
  </div>
```

Of course, we can give some initial values to these fields via the `initialValues` property of the `FormProvider`

```jsx
  <FormProvider
    initialValue={{
      input1 : 'input@email.bum',
      input2 : 'input2',
      input3 : true,
      input4 : 'option A',
      // input5: 'saab',
      input6 : 'Textarea initial value here',
    }}
  >
    { /* ... */ }
  </FormProvider>
```

And, of course, we can apply some validator to each field's change. This validator will be called on each change of value and has to return an array within error messages found in the value if any.

```js
  function handleOnValidate( value ){
    // ...
    return ['The value is not valide!']
  }
  
  <Input fieldName='input1'
    onValidate={ handleOnValidate }
  />
```

In the case we need to add some async validation, it can be done like in the example below. After the async validation finished, the handler has to call the `invalidate` method, passed to the validator, with the validated value and the errors array as the properties. These errors are applied to the field only if the value wasn't changed while the validation was performed.

```jsx
  function handleOnValidate( value, invalidate ){
    setTimeout(
      () => invalidate( value, ['Async Err'])
      , 1000 )
    return ['Sync Err']
  }
```

While validators are used to set the valid property of a filed, there is anoter event `onTest` whith handler which can prevent of the field changes. It sets `declined` property of the field to true after some change is prevented. It stays positive till another, accepted, change heppens.

```js
  function handleOnTest( value ){
    return val => val!=='test' // accepts all the values except 'test'
  }
  
  <Input fieldName='input1'
    onTest={ handleOnTest }
  />
```

Except the listed above, there are several additional options useful while a form building. 

Event `onChange` of the FormProvider which is firing each time when something is changed in the form state.

```jsx
  <FormProvider
    onChange={( fieldsState ) => console.log( 'Form Changed'/*, fieldsState */ )} 
  >
    { /* ... */ }
  </FormProvider>
```

Event `onReady` of the `FormProvider` which is calling when the form is ready and gets `formLink` as the only parameter. Is it the same structure which a control gets from `withFormContext` HoC described earlier.

```
  <FormProvider
    onReady={formLink => { formRef = formLink }} 
  >
    { /* ... */ }
  </FormProvider>
```

Property `option` is used with `asRadioButtonField` HoC to define the value specified by each control.

```jsx
  <RadioButton fieldName='input4' option='option A'/>
  <RadioButton fieldName='input4' option='option B' />
```

Property `disabled` available for the inputs. The `true` value of it causes that no form value of the field can be changed.

```jsx
  <Input fieldName='input2' type='password'
    disabled
    onValidate={handleOnValidate}
  />
```

Finally, it has to be mentioned that all properties unknown to the HoCs are transparently passing to the input component. It means that you can use any styling and element-specific properties to generate any HTML you need.

---

Newcomers

`normalize` property allows to set a handler which will take the updated field value and return it "normilized".
