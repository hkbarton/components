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

import { useTranslation } from 'react-i18next'
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import styled from 'styled-components'
import { Icon, IconPlaceholder } from '../../../Icon'
import { Spinner } from '../../../Spinner'
import { ListDivider } from '../../../List/ListDivider'
import { ListItemDetail } from '../../../List/ListItemDetail'
import { ListItemPreface } from '../../../List/ListItemPreface'
import { Heading, HeadingProps, Paragraph, Text } from '../../../Text'
import { useID } from '../../../utils'
import {
  ComboboxContext,
  ComboboxMultiContext,
  ComboboxMultiOption,
  ComboboxOption,
  ComboboxOptionIndicator,
  ComboboxOptionIndicatorProps,
  ComboboxOptionText,
} from '../Combobox'
import { FlatOption, SelectOptionObject } from './types'
import { optionsHaveIcons, notInOptions } from './utils/options'
import { useWindowedOptions } from './utils/useWindowedOptions'

export const SelectOptionsContext = createContext({ hasIcons: false })
interface OptionLayoutProps
  extends Pick<ComboboxOptionIndicatorProps, 'indicator'> {
  option: SelectOptionObject
  scrollIntoView?: boolean
}

interface OptionLayoutBaseProps extends OptionLayoutProps {
  isMulti?: boolean
}

const OptionLayoutBase = ({
  isMulti,
  option,
  scrollIntoView,
}: OptionLayoutBaseProps) => {
  const { description, detail, preface, ...rest } = option
  const Component = isMulti ? ComboboxMultiOption : ComboboxOption

  if (description || detail || preface) {
    return (
      <Component
        {...rest}
        py={preface || description ? 'xsmall' : 'xxsmall'}
        scrollIntoView={scrollIntoView}
      >
        <SelectOptionWithDescription
          description={description}
          preface={preface}
          {...rest}
        />
        {detail && <ListItemDetail>{detail}</ListItemDetail>}
      </Component>
    )
  }
  return <Component {...rest} />
}

// Use an FC since isActive & isSelected are passed to the indicator via cloneElement
// and otherwise would get spread onto Icon
const OptionIcon: FC<SelectOptionObject> = ({ preface, icon }) =>
  icon ? (
    <Icon
      size="small"
      mt={preface ? 'medium' : 'none'}
      color="text1"
      icon={icon}
      data-testid="option-icon"
    />
  ) : null

const OptionLayout = ({ option, ...rest }: OptionLayoutProps) => {
  const { hasIcons } = useContext(SelectOptionsContext)
  const { indicatorPropRef } = useContext(ComboboxContext)
  const iconPlaceholder = hasIcons ? (
    <IconPlaceholder size="small" data-testid="option-icon-placeholder" />
  ) : undefined

  const indicator = option.icon ? (
    <OptionIcon {...option} />
  ) : (
    // Either an option or Select-level indicator can override the iconPlaceholder
    option.indicator || indicatorPropRef?.current || iconPlaceholder
  )

  useEffect(() => {
    if (option.icon && option.indicator) {
      // eslint-disable-next-line no-console
      console.warn('Use icon or indicator but not both at the same time.')
    }
  }, [option.icon, option.indicator])

  return <OptionLayoutBase {...rest} option={{ ...option, indicator }} />
}

const MultiOptionLayout = (props: OptionLayoutProps) => (
  <OptionLayoutBase {...props} isMulti />
)

export const SelectOptionWithDescription = ({
  description,
  preface,
}: SelectOptionObject) => {
  return description || preface ? (
    <div>
      {preface && <ListItemPreface>{preface}</ListItemPreface>}
      <Paragraph fontSize="small" lineHeight="small">
        <ComboboxOptionText />
      </Paragraph>
      {description && (
        <Paragraph color="text2" fontSize="xsmall" lineHeight="xsmall">
          {description}
        </Paragraph>
      )}
    </div>
  ) : (
    <ComboboxOptionText />
  )
}

const SelectOptionGroupTitle = styled(Heading).attrs<HeadingProps>(() => ({
  color: 'subdued',
  fontFamily: 'body',
  fontSize: 'xxsmall',
  fontWeight: 'semiBold',
  px: 'xsmall',
  py: 'xxsmall',
}))<{ isMulti?: boolean }>`
  display: flex;
  padding-top: ${({ theme }) => theme.space.xxsmall};
`

export interface SelectOptionsBaseProps {
  /**
   * The user can type in the input (default false to mimic traditional select tag)
   */
  isFilterable?: boolean
  /**
   * Text to show when there are no available options
   * @default 'No options'
   */
  noOptionsLabel?: string
  /**
   * Render only the options visible in the scroll window
   */
  windowedOptions?: boolean
  /**
   * Add an on-the-fly option mirroring the typed text (use when isFilterable = true)
   * When `true`, notInOptions is used to show/hide and can be included in a custom function
   */
  showCreate?: boolean
  /**
   * Format the label of the on-the-fly create option (use with canCreate)
   * @default `Create ${inputText}`
   */
  formatCreateLabel?: (inputText: string) => ReactNode
  /**
   * Render a spinner in the list instead of any options
   * @default false
   */
  isLoading?: boolean
}

export interface SelectOptionsProps extends SelectOptionsBaseProps {
  flatOptions?: FlatOption[]
  navigationOptions?: SelectOptionObject[]
  isMulti?: boolean
}

export const SelectOptions = (props: SelectOptionsProps) => {
  const { t } = useTranslation('SelectOptions')
  const noOptionsLabelText = t('No options')

  const {
    flatOptions,
    navigationOptions,
    isFilterable,
    showCreate,
    formatCreateLabel,
    isMulti,
    noOptionsLabel = noOptionsLabelText,
    windowedOptions,
    isLoading,
  } = props

  const {
    start,
    end,
    before,
    after,
    scrollToFirst,
    scrollToLast,
  } = useWindowedOptions(
    windowedOptions,
    flatOptions,
    navigationOptions,
    isMulti
  )
  const keyPrefix = useID(flatOptions?.length.toString())

  const hasIcons = useMemo(() => optionsHaveIcons(navigationOptions), [
    navigationOptions,
  ])

  if (isLoading) {
    return (
      <EmptyListItem>
        <Spinner size={30} aria-label={t('Loading')} />
      </EmptyListItem>
    )
  }

  const optionsToRender = flatOptions ? flatOptions.slice(start, end + 1) : []
  const OptionLayoutToUse = isMulti ? MultiOptionLayout : OptionLayout

  const noOptions = (
    <EmptyListItem>
      <Text color="subdued">{noOptionsLabel}</Text>
    </EmptyListItem>
  )

  const createOption = isFilterable && showCreate && (
    <SelectCreateOption
      options={navigationOptions}
      formatLabel={formatCreateLabel}
      noOptions={noOptions}
      isMulti={isMulti}
      key="create"
    />
  )

  return (
    <SelectOptionsContext.Provider value={{ hasIcons }}>
      {navigationOptions && scrollToFirst ? (
        <OptionLayoutToUse
          option={navigationOptions[0]}
          key={`${keyPrefix}-0`}
          scrollIntoView={true}
        />
      ) : null}
      {before}
      {optionsToRender && optionsToRender.length > 0
        ? [
            ...optionsToRender.map((option, index) => {
              // Add start to index to keep key consistent if options are windowed
              const key = `${keyPrefix}-${start + index}`
              if (option.value !== undefined) {
                const OptionLayoutToUse = isMulti
                  ? MultiOptionLayout
                  : OptionLayout
                return (
                  <OptionLayoutToUse
                    option={option as SelectOptionObject}
                    key={key}
                  />
                )
              } else if (option.label !== undefined) {
                return (
                  <SelectOptionGroupTitle isMulti={isMulti} key={key}>
                    <ComboboxOptionIndicator indicator={isMulti && ' '} />
                    {option.label}
                  </SelectOptionGroupTitle>
                )
              }
              return <ListDivider key={key} />
            }),
            createOption,
          ]
        : createOption || noOptions}
      {after}
      {navigationOptions && scrollToLast ? (
        <OptionLayoutToUse
          option={
            navigationOptions[
              navigationOptions.length - 1
            ] as SelectOptionObject
          }
          key={`${keyPrefix}-${navigationOptions.length - 1}`}
          scrollIntoView
        />
      ) : null}
    </SelectOptionsContext.Provider>
  )
}

interface SelectCreateOptionProps {
  options?: SelectOptionObject[]
  noOptions: ReactNode
  formatLabel?: (inputText: string) => ReactNode
  isMulti?: boolean
}

const SelectCreateOption = ({
  options,
  noOptions,
  formatLabel,
  isMulti,
}: SelectCreateOptionProps) => {
  const { data } = useContext(ComboboxContext)
  const { data: dataMulti } = useContext(ComboboxMultiContext)

  const inputValue = isMulti ? dataMulti.inputValue : data.inputValue

  const shouldShow = useMemo(() => {
    const currentOptions = isMulti
      ? dataMulti.options
      : data.option
      ? [data.option]
      : []
    return notInOptions(currentOptions, options, inputValue)
  }, [isMulti, data.option, dataMulti.options, options, inputValue])

  if (!shouldShow || !inputValue) {
    if (!options || options.length === 0) return <>{noOptions}</>
    return null
  }

  const OptionComponent = isMulti ? ComboboxMultiOption : ComboboxOption

  return (
    <OptionComponent value={inputValue} highlightText={false} indicator={false}>
      {formatLabel ? formatLabel(inputValue) : `Create "${inputValue}"`}
    </OptionComponent>
  )
}

const EmptyListItem = styled.li`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => `${theme.space.xlarge} ${theme.space.medium}`};
`
