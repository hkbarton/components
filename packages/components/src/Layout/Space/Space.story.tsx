/*

 MIT License

 Copyright (c) 2021 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import { Story } from '@storybook/react/types-6-0'
import { AccountCircle } from '@styled-icons/material-outlined/AccountCircle'
import { Delete } from '@styled-icons/material/Delete'
import React from 'react'
import { Button, IconButton } from '../../Button'
import { Icon } from '../../Icon'
import { Status } from '../../Status'
import { Paragraph } from '../../Text'
import { Space, SpaceHelperProps } from './Space'

export default {
  component: Space,
  title: 'Space',
}

const Template: Story<SpaceHelperProps> = (args) => (
  <Space {...args}>
    <Button>Button A</Button>
    <Button>Button B</Button>
    <Button>Button C</Button>
  </Space>
)

export const Basic = Template.bind({})
Basic.args = {}

export const Reverse = Template.bind({})
Reverse.args = {
  ...Basic.args,
  reverse: true,
}

export const SpaceCrush = () => (
  <Space>
    <Icon icon={<AccountCircle />} size="large" />
    <Status intent="inform" />
    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </Paragraph>
    <Paragraph>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </Paragraph>
  </Space>
)

export const SpaceWrap = () => (
  <>
    <Space maxWidth="20rem" flexWrap="wrap">
      <IconButton label="boo" icon={<Delete />} />
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
    </Space>

    <Space reverse maxWidth="20rem" flexWrap="wrap">
      <IconButton label="boo" icon={<Delete />} />
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
      <button>boo</button>
    </Space>
  </>
)
