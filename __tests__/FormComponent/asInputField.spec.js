import { mount } from 'enzyme';

import React, { Component } from 'react'
import { FormProvider, withFormContext } from 'FormProvider'
import { asInputField } from 'FormComponent'

// >> -------------------------------------------------------------------------

  const testFieldName = 'testField'

// ----------------------------------------------------------------------------

  const renderTestForm = ({ formProps, fieldProps }) => {

    let fieldRef = null
    let monitorRef = null

    class _TestProbe extends Component {
      constructor(props){
        super(props)
      }
      render(){
        fieldRef = this
        return <input { ...this.props }/>
      }
    }

    class _StateMonitor extends Component {
      constructor(props){
        super(props)
      }
      render(){
        monitorRef = this
        return null
      }
    }

    const TestProbe = asInputField( _TestProbe )
    const StateMonitor = withFormContext( _StateMonitor )

    const wrapper = mount(
      <FormProvider { ...formProps }>
        <TestProbe { ...fieldProps }/>
        <StateMonitor/>
      </FormProvider>
    );

    const { formLink } = monitorRef.props
    const fieldLink = fieldRef.props

    const getFieldState = () => {
      const fieldState = formLink.getFieldState(fieldProps.fieldName)
      delete fieldState.reset
      return fieldState
    }

    return {
      wrapper,
      formLink,
      fieldLink,
      getFieldState,
    }
  }

// << -------------------------------------------------------------------------

describe('asInputField', function () {

  const { wrapper, formLink, fieldLink, getFieldState } = renderTestForm({
    formProps: { initialValue: { testFieldName: 'initial value'} },
    fieldProps: { fieldName: 'testFieldName' }
  })

  it('simulate change', () => {
    const event = {
      preventDefault() {},
      target: { value: 'the-value' }
    };

    wrapper.find('input').simulate('change', event)
    expect( getFieldState() ).toEqual({
      "declined": false,
      "dirty": true,
      "errors": [],
      "focused": false,
      "touched": false,
      "valid": true,
      "value": "the-value",
    })
  })
})
