// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { XTextbox, Textbox } from './textbox'
import * as T from './qd'

const name = 'textbox'
const textboxProps: Textbox = { name }

describe('Textbox.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    T.qd.args[name] = null
  })

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XTextbox model={textboxProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Renders data-test attr - masked', () => {
    const { queryByTestId } = render(<XTextbox model={{ ...textboxProps, mask: 'mask' }} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init - no value specified', () => {
    render(<XTextbox model={textboxProps} />)
    expect(T.qd.args[name]).toBe('')
  })

  it('Sets args - init - value specified', () => {
    render(<XTextbox model={{ ...textboxProps, value: 'text' }} />)
    expect(T.qd.args[name]).toBe('text')
  })


  it('Sets args on input', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: 'text' } })
    jest.runOnlyPendingTimers()

    expect(T.qd.args[name]).toBe('text')
  })

  it('Sets args on input - undefined value, no default value specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(T.qd.args[name]).toBe('')
  })

  it('Sets args on input - undefined value, default value specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, value: 'default' }} />)
    fireEvent.change(getByTestId(name), { target: { value: undefined } })

    expect(T.qd.args[name]).toBe('default')
  })

  it('Calls sync on change - trigger specified', () => {
    const { getByTestId } = render(<XTextbox model={{ ...textboxProps, trigger: true }} />)

    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(syncMock).not.toBeCalled() // Not called immediately, but after specified timeout.
    jest.runOnlyPendingTimers()
    expect(syncMock).toBeCalled()
  })

  it('Does not call sync on change - trigger not specified', () => {
    const { getByTestId } = render(<XTextbox model={textboxProps} />)

    const syncMock = jest.fn()
    T.qd.sync = syncMock

    fireEvent.change(getByTestId(name), { target: { value: 'aaa' } })

    expect(syncMock).not.toBeCalled()
  })
})