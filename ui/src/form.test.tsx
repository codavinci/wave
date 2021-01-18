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
import { render } from '@testing-library/react'
import { View } from './form'
import * as T from './qd'

const
  name = 'form',
  formProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Form.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...formProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  describe('Component spacing', () => {
    const content = 'Text'

    it('Should not add top margin to first visible element', () => {
      const props = {
        ...formProps,
        state: {
          items: [
            { text: { content } },
          ]
        }
      }
      const { getByTestId } = render(<View {...props} />)
      expect(getByTestId('form-item-0').style.marginTop).toBe('0px')
    })

    it('Should not add top margin if previous component is invisible and second becomes visually first', () => {
      const props = {
        ...formProps,
        state: {
          items: [
            { text: { content, visible: false } },
            { text: { content } },
          ]
        }
      }
      const { getByTestId } = render(<View {...props} />)
      expect(getByTestId('form-item-0').style.marginTop).toBe('0px')
      expect(getByTestId('form-item-1').style.marginTop).toBe('0px')
    })

    it('Should remove top margin to invisible components only', () => {
      const props = {
        ...formProps,
        state: {
          items: [
            { text: { content } },
            { text: { content } },
            { text: { content, visible: false } },
          ]
        }
      }
      const { getByTestId } = render(<View {...props} />)
      expect(getByTestId('form-item-0').style.marginTop).toBe('0px')
      expect(getByTestId('form-item-1').style.marginTop).toBe('10px')
      expect(getByTestId('form-item-2').style.marginTop).toBe('0px')
    })
  })
})