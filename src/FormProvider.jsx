import React, { Component } from 'react'

const FormContext = React.createContext( null )
// Note: createContext takes the default context state
// used while the component in placed outside the context

export class FormProvider extends Component {

  static defaultProps = {
    initialValue : {},
    onChange     : () => {},
    onReady      : () => {},
  }

  state = { formBuffer: {}, blocked: false }

  constructor( props ){
    super( props )

    this._getFormValue = this._getFormValue.bind( this )
    this._getFormState = this._getFormState.bind( this )
    this._resetForm = this._resetForm.bind( this )
    this._getFormLink = this._getFormLink.bind( this )

    const { formBuffer } = this.state
    const formLink = this._getFormLink()
    this.props.onReady( formLink )
  }

  _getFormValue(){
    const { formBuffer } = this.state
    const acc = {}
    Object.keys( formBuffer ).map( fieldName => {
      acc[fieldName] = formBuffer[fieldName].value
    })
    return acc
  }

  _getFormState(){
    const { formBuffer } = this.state
    const stateAcc = { dirty: false, touched: false, valid: true }
    Object.keys( formBuffer ).map( fieldName => {
      stateAcc.dirty = stateAcc.dirty || formBuffer[fieldName].dirty
      stateAcc.touched = stateAcc.touched || formBuffer[fieldName].touched
      stateAcc.valid = !stateAcc.valid || !formBuffer[fieldName].valid
    })
    return stateAcc
  }

  _resetForm(){
    const { formBuffer } = this.state
    Object.keys( formBuffer ).map( fieldName => formBuffer[fieldName].reset())
  }

  _getFormLink(){
    const formLink = {

      /* field mathods */

      setFieldState : ( fieldName, fieldState, cb ) => this.setState(( prevState, props ) => ({
        ...prevState,
        formBuffer : {
          ...prevState.formBuffer,
          [fieldName] : fieldState,
        },
      }), () => {
        const { onChange } = this.props
        if( cb ){ cb() }
        onChange( this.state.formBuffer )
      }),

      getFieldState : ( fieldName ) => this.state.formBuffer[fieldName],

      getFieldInitialValue : ( fieldName ) => this.props.initialValue[fieldName],

      /* form methods */

      // __setState : this.setState, // undocumented for now

      getFormState : () => this._getFormState(),

      getFormValue : () => this._getFormValue(),

      getFieldsState : () => this.state.formBuffer,

      resetForm : () => this._resetForm(),
    }
    return formLink
  }

  /**
   * `render` is only used to render the component's children in the context of the
   * `formLink` structure which contains all of the necessary form-wide fields.
   * @return {Component}
   */
  render(){
    const formLink = this._getFormLink()
    return (
      <FormContext.Provider value={formLink}>
        {this.props.children}
      </FormContext.Provider>
    )
  }

}

/**
 * HOC which is used to convert Basic Input Components to those connected to the form's context.
 * @param  {Component} FormComponent - one of the Basic Input Components.
 * @return {Component} - Connected to the form's context Component.
 */
export const withFormContext = FormComponent =>
  class extends Component {

    render(){
      return (
        <FormContext.Consumer>
          { formLink => <FormComponent {...this.props} formLink={formLink} /> }
        </FormContext.Consumer>
      )
    }

  }
