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

import { width, WidthProps } from '@looker/design-tokens'
import React, { FunctionComponent, useContext } from 'react'
import styled, { css } from 'styled-components'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { Paragraph, Text } from '../../Text'
import { FieldsetContext } from '../Fieldset'
import { inputHeight } from '../Inputs/height'
import { Label } from '../Label'
import { VisuallyHidden } from '../../VisuallyHidden'
import { ValidationMessage } from '../ValidationMessage'
import { FieldBaseProps } from './FieldBase'
import { RequiredStar } from './RequiredStar'

export interface FieldProps extends FieldBaseProps, WidthProps {
  /**
   * Id of the input element to match a label to.
   */
  id?: string
  /**
   * Determines where to place the label in relation to the input.
   * @default false
   */
  inline?: boolean
  /**
   * Hide label on Field
   * @default false
   */
  hideLabel?: boolean
  /**
   *
   */
  ariaLabelOnly?: boolean
}

export const fieldPropKeys = [
  'description',
  'detail',
  'id',
  'inline',
  'label',
  'hideLabel',
  'labelWidth',
  'validationMessage',
  'width',
]

export const pickFieldProps = (props: FieldProps) =>
  pick(props, [
    ...fieldPropKeys,
    'disabled',
    'required',
    'className',
    'autoResize',
  ])

export const omitFieldProps = (props: FieldProps) => omit(props, fieldPropKeys)

/**
 * `<Field />` allows the rendering of a label (optionally associated with a child input like `<InputText />`),
 * and can render a validation message. Generally, this component is used with form inputs to give user
 * feedback about the status of the input values.
 */

interface FieldPropsInternal extends FieldProps {
  id: string
}

const FieldLayout: FunctionComponent<FieldPropsInternal> = ({
  className,
  children,
  description,
  detail,
  id,
  ariaLabelOnly,
  label,
  hideLabel,
  required,
  validationMessage,
}) => {
  const { fieldsHideLabel } = useContext(FieldsetContext)

  const fieldDescription = description && (
    <Paragraph mt="xsmall" fontSize="xsmall" color="text2">
      {description}
    </Paragraph>
  )

  const fieldValidation = validationMessage && (
    <ValidationMessage {...validationMessage} />
  )

  const labelComponent = (
    <Label htmlFor={ariaLabelOnly ? undefined : id} id={`labelledby-${id}`}>
      {label}
      {required && <RequiredStar />}
    </Label>
  )

  return (
    <div className={className}>
      {(fieldsHideLabel || hideLabel) && hideLabel !== false ? (
        <VisuallyHidden>{labelComponent}</VisuallyHidden>
      ) : (
        labelComponent
      )}
      {detail && <FieldDetail>{detail}</FieldDetail>}
      <InputArea>{children}</InputArea>
      <MessageArea id={`describedby-${id}`}>
        {fieldDescription}
        {fieldValidation}
      </MessageArea>
    </div>
  )
}

const FieldDetail = styled(Text).attrs(() => ({
  color: 'inherit',
  fontSize: 'xsmall',
  lineHeight: 'xsmall',
}))``

const InputArea = styled.div`
  /* Workaround for Chip's truncate styling breaking flexbox layout in FieldChips */
  min-width: 0;
`
const MessageArea = styled.div``

const fieldLabelCSS = (inline?: boolean) =>
  inline
    ? css`
        height: ${inputHeight};
        justify-self: end;
        line-height: ${inputHeight};
        padding-right: ${({ theme }) => theme.space.small};
        text-align: right;
      `
    : css`
        line-height: ${({ theme }) => theme.lineHeights.xsmall};
        padding-bottom: ${({ theme }) => theme.space.xxsmall};
      `

const inlineTemplateAreas = css`
  grid-template-areas: 'label input detail' '. messages messages';
`

const templateAreas = css`
  grid-template-areas: 'label detail' 'input input' 'messages messages';
`

export const Field = styled(FieldLayout)<FieldPropsInternal>`
  align-items: left;

  display: ${({ autoResize }) => (autoResize ? 'inline-grid' : 'grid')};
  ${({ inline }) => (inline ? inlineTemplateAreas : templateAreas)}
  grid-template-columns: ${({ inline }) => (inline ? '150px 1fr' : undefined)};
  height: fit-content;
  justify-content: space-between;
  width: ${({ autoResize }) => (autoResize ? 'fit-content' : '100%')};
  ${width}

  ${InputArea} {
    align-items: center;
    ${({ autoResize }) =>
      autoResize &&
      css`
        align-items: stretch;
        display: flex;
        flex-direction: column;
      `}
    grid-area: input;
  }

  ${MessageArea} {
    grid-area: messages;
  }

  & > ${Label} {
    grid-area: label;
    ${({ inline }) => fieldLabelCSS(inline)}
  }

  ${FieldDetail} {
    grid-area: detail;
    justify-self: end;
    padding-left: ${({ theme: { space } }) => space.small};

    ${({ inline }) =>
      inline &&
      css`
        align-self: center;
      `}
  }

  ${ValidationMessage} {
    margin-top: ${({ theme }) => theme.space.xsmall};
  }
`
