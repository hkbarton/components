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

import 'jest-styled-components'
import React from 'react'
import { renderWithTheme } from '@looker/components-test-utils'
import { Favorite } from '@styled-icons/material/Favorite'
import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Tooltip } from '../Tooltip'
import { IconButton } from './IconButton'

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})
const runTimers = () =>
  act(() => {
    jest.runOnlyPendingTimers()
  })

describe('IconButton', () => {
  test('toggle applies aria-pressed', () => {
    renderWithTheme(<IconButton label="Test" icon={<Favorite />} toggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed')
  })

  test('aria-pressed not present without toggle', () => {
    renderWithTheme(<IconButton label="Test" icon={<Favorite />} />)
    const button = screen.getByRole('button')
    expect(button).not.toHaveAttribute('aria-pressed')
  })

  test('allows for ARIA attributes', () => {
    renderWithTheme(
      <IconButton label="Test" icon={<Favorite />} aria-haspopup />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup')
  })

  test('accepts events', async () => {
    const fauxMouseEnter = jest.fn()
    const fauxClick = jest.fn()
    const label = 'Test'

    renderWithTheme(
      <IconButton
        label="Test"
        icon={<Favorite />}
        onMouseEnter={fauxMouseEnter}
        onClick={fauxClick}
      />
    )

    const button = screen.getByRole('button')

    fireEvent.mouseOver(button)
    expect(fauxMouseEnter).toHaveBeenCalledTimes(1)
    fireEvent.mouseOut(button)
    runTimers()
    await waitForElementToBeRemoved(() => screen.getAllByText(label)[1])

    fireEvent.click(button)
    expect(fauxClick).toHaveBeenCalledTimes(1)
  })

  test('has built-in tooltip', async () => {
    const label = 'Mark as my Favorite'
    renderWithTheme(<IconButton label={label} icon={<Favorite />} />)

    const notTooltip = screen.getByText(label)
    expect(notTooltip).toBeInTheDocument() // accessibility text

    const icon = screen.getByText(label)
    fireEvent.mouseOver(icon)
    runTimers()

    const tooltip = screen.getAllByText(label)
    expect(tooltip).toHaveLength(2)
    expect(tooltip[1]).toBeVisible()

    fireEvent.mouseOut(icon)
    await waitForElementToBeRemoved(() => screen.getAllByText(label)[1])
  })

  test('tooltipDisabled actually disables tooltip', () => {
    const label = 'Mark as my Favorite'
    renderWithTheme(
      <IconButton
        id="test-iconButton"
        tooltipDisabled
        label={label}
        icon={<Favorite />}
      />
    )

    fireEvent.mouseOver(screen.getAllByText(label)[0])
    runTimers()

    // Get Tooltip content
    const notTooltip = screen.queryAllByText(label)
    expect(notTooltip.length).toEqual(1)
  })

  test('built-in tooltip defers to outer tooltip', async () => {
    const tooltip = 'Add to favorites'
    const label = 'Mark as my Favorite'
    renderWithTheme(
      <Tooltip content={tooltip}>
        <IconButton label={label} icon={<Favorite />} />
      </Tooltip>
    )

    const button = screen.getByRole('button')
    fireEvent.mouseOver(button)
    runTimers()

    expect(screen.getByText(tooltip)).toBeInTheDocument()

    const iconLabel = screen.getByText(label)
    expect(iconLabel).toBeInTheDocument()

    const tooltipContents = screen.getByText(tooltip) // Get all Tooltip contents
    expect(tooltipContents).toBeVisible()

    fireEvent.mouseOut(button)
    await waitForElementToBeRemoved(() => screen.getByText(tooltip))
  })

  test('built-in tooltip respects text-align, width props', async () => {
    const label = 'Mark as my Favorite'
    renderWithTheme(
      <IconButton
        tooltipWidth="4rem"
        tooltipTextAlign="right"
        label={label}
        icon={<Favorite />}
      />
    )

    const trigger = screen.getByText(label)
    fireEvent.mouseOver(trigger)
    runTimers()

    const tooltip = screen.queryAllByText(label)
    expect(tooltip[0]).toBeVisible()
    expect(tooltip[0]).toHaveStyleRule('max-width', '4rem')
    expect(tooltip[0]).toHaveStyleRule('text-align', 'right')

    fireEvent.mouseOut(trigger)
    await waitForElementToBeRemoved(() => screen.getAllByText(label)[1])
  })

  test('toggleBackground renders a background', () => {
    renderWithTheme(
      <IconButton label="Test" toggle toggleBackground icon={<Favorite />} />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveStyle('background-color: #F3F2FF;')
  })

  test('toggleBackground with shape renders a round background', () => {
    renderWithTheme(
      <IconButton
        icon={<Favorite />}
        label="Test"
        shape="round"
        toggle
        toggleBackground
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveStyle('background-color: #F3F2FF;')
    expect(button).toHaveStyle('border-radius: 100%;')
    expect(button).toHaveStyle('color: #6c43e0;')
  })

  test('toggleColor', () => {
    renderWithTheme(
      <IconButton
        label="Test"
        toggle
        toggleBackground
        toggleColor="calculation"
        icon={<Favorite />}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toHaveStyle('background-color: #eaf4e8;')
    expect(button).toHaveStyle('color: #319220;')
  })
})
