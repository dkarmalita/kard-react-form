import React, { Component } from 'react'
// import { objectsEqual } from './utils/objectsEqual'
import { combineArraysUnique as combineErrors } from './utils/combineArraysUnique'
import { withFormContext } from './FormProvider'

/**
 * A link which become a part of error message. Should point to the documentation.
 */
// eslint-disable-next-line camelcase
const helpLink_formBoundaries = 'http://example.com'

/**
 * Note: About field state. Each field has several properties in its state:
 * - value {Any} - contains the field value
 * - errors {Array of Strings} - contains error messages of the current value
 * - focused {Bool} - true while the field focused
 * - dirty {Bool} - true while the field contains changed value
 * - touched {Bool} - true while the field is/was focused
 * - valid {Bool} - true while the field contains no errors
 * - declined {Bool} - true when the latest value was declined by onTest handler
 */
export const asField = ( WrappedField, defaultValue = '' ) => {
  class _FormComponent extends Component {

    static defaultProps = {
      // defaultValue: '',
      fieldName  : '',
      onValidate : () => [],
      onTest     : () => true,
    }

    constructor( props ){
      super( props )
      this._getInitialValue = this._getInitialValue.bind( this )
      this._setFieldState = this._setFieldState.bind( this )
      this._getFieldState = this._getFieldState.bind( this )
      this._setFieldValue = this._setFieldValue.bind( this )
      this._getFieldValue = this._getFieldValue.bind( this )
      this._invalidate = this._invalidate.bind( this )
      this._setFieldValue = this._setFieldValue.bind( this )
      this._checkFormContext = this._checkFormContext.bind( this )
      this._setFocused = this._setFocused.bind( this )
      this._getCleanProps = this._getCleanProps.bind( this )
      this._init = this._init.bind( this )
      this._init()
    }

    _init(){
      this._setFieldState({
        ...this._prepareState( this._getInitialValue()),
        touched : false,
        focused : false,
        reset   : this._init,
      })
    }

    /**
     * The only method to get initial value from the level of form
     * @return {Any} - initial value or undefined if no value is given
     */
    _getInitialValue(){
      if( !this._checkFormContext()){ return }
      const { fieldName, formLink } = this.props
      return formLink.getFieldInitialValue( fieldName ) || defaultValue
    }

    /**
     * The only method to set state of the field
     * @param {Object} newState - the whole field state
     */
    _setFieldState( newState ){
      if( !this._checkFormContext()){ return }
      const { fieldName, formLink } = this.props
      const oldState = this._getFieldState()
      // if( objectsEqual( oldState, newState )){ return } // prevent state update if no changes in it
      formLink.setFieldState( fieldName, newState )
    }

    /**
     * The only method to get state of the field
     * @return {Object} - the state of the field
     */
    _getFieldState(){
      if( !this._checkFormContext()){ return }
      const { fieldName, formLink } = this.props
      const state = formLink.getFieldState( fieldName )
      return typeof state != 'undefined' ? state : {}
    }

    /**
     * Check if the Component is placed inside a form context.
     * Puts the error message in the console only one time per component.
     * @return {Bool} - true while the field is in a form context, false - in other case
     */
    _checkFormContext(){
      if( this.props.formLink ){ return true }
      if( this.errorShown ){ return false }
      console.error(
        `${this.constructor.name} must be used in bounds of FormProvider. `
        // eslint-disable-next-line camelcase
        + `Visit ${helpLink_formBoundaries} to learn more about the form boundaries.`
      )
      this.errorShown = true
      return false
    }

    /**
     * The only method to prepare the data state for a value within valid, errors and dirty fields filled
     * @param {Any} newValue - new field value
     * @return {Object} - field state within all data propeties
     */
    _prepareState( value ){
      const declined = !this.props.onTest( value )
      if( declined ){
        return { ...this._getFieldState(), declined }
      }
      const dirty = value !== this._getInitialValue()
      const errors = this.props.onValidate( value, this._invalidate )
      const valid = errors.length === 0
      return { ...this._getFieldState(), value, dirty, errors, valid, declined }
    }

    /**
     * The only method to set value of the field. Except the value, the method sets data-related field's properties: valid, errors and dirty.
     * @param {Any} newValue - new field value
     */
    _setFieldValue( value ){
      if( this.props.disabled ){ return } // only an enabled field can update its value
      this._setFieldState( this._prepareState( this.props.normalize ? this.props.normalize(value) : value ))
    }

    /**
     * The main method to get field value. _getFieldState is better to use in cases when you need to get fields attributes too.
     * @return {Any} - the current value of the field
     */
    _getFieldValue(){
      return this._getFieldState().value
    }

    /**
     * The method is used to invalidate some value of the field. It is passed as the second paramater to onValidate handler and is used for async invalidation (see example)
     * @param  {Any} value - a value to invalidate
     * @param  {Array of Strings} errors - an array of errors found
     * @return {[type]}        [description]
     * @example
     *   function handleOnValidate( value, invalidate ){
     *     getAsyncErrors( value ).then( { value, errors }=>invalidate( value, errors ) )
     *     return getSyncErrors( value )
     *   }
     */
    _invalidate( value, errors = []){
      const state = this._getFieldState()
      if( state.value !== value || errors.length === 0 ){ return }
      const nextErrors = combineErrors( state.errors, errors )
      this._setFieldState({ ...state, errors: nextErrors })
    }

    /**
     * The only method to change focused value, keeps its eye on the touched property too.
     * @param {Bool} focused - the focused state to set.
     */
    _setFocused( focused ){
      const oldState = this._getFieldState()
      const touched = focused || oldState.focused
      this._setFieldState({ ...oldState, focused, touched })
    }

    /**
     * The only method allows to get props cleaned from form-specific instances, suitable to be passed to a DOM tag.
     * @return {Objec} - cleaned property set
     */
    _getCleanProps(){
      const {       /* = known field properties = */
        fieldName,  // used as the field name in the form buffer /* --and as a value of name prop-- */
        onValidate, // used each time when a change happen to validate the updated value
        onTest,
        formLink,   // provides the form-level methods
        // option,  // for multi-controls fields, contains option value for this control
        normalize,
        ...other
      } = this.props
      return other
    }

    render(){
      const value = this._getFieldValue()
      return (
        <WrappedField
          {...this._getCleanProps()}
          value={typeof value != 'undefined' ? value : defaultValue}
          onChange={( value ) => this._setFieldValue( value )}
          onFocus={() => this._setFocused( true )}
          onBlur={() => this._setFocused( false )}
          // name={ this.props.fieldName }
        />
      )
    }

  }

  return withFormContext( _FormComponent )
}

/* connection models HOCs */

export const asInputField = ( InputComponent ) => {
  class WrappedInput extends Component {

    render(){
      return (
        <InputComponent {...this.props}
          onChange={( event ) => this.props.onChange( event.target.value )}
        />
      )
    }

  }
  return asField( WrappedInput )
}

export const asCheckboxField = ( InputComponent ) => {
  class WrappedInput extends Component {

    render(){
      return (
        <InputComponent {...this.props}
          onChange={null}
          checked={this.props.value}
          onClick={() => this.props.onChange( !this.props.value )}
          onKeyPress={() => this.props.onChange( !this.props.value )} // add support of keyboard enter
        />
      )
    }

  }
  return asField( WrappedInput )
}

export const asRadioButtonField = ( InputComponent ) => {
  class WrappedInput extends Component {

    render(){
      return (
        <InputComponent {...this.props}
          onChange={null}
          checked={this.props.value === this.props.option}
          onClick={() => this.props.onChange( this.props.option )}
        />
      )
    }

  }
  return asField( WrappedInput )
}
