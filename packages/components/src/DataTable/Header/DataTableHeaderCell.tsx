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
import React, { useContext, forwardRef, Ref } from 'react'
import styled from 'styled-components'
import { ExpandLess } from '@styled-icons/material-rounded/ExpandLess'
import { ExpandMore } from '@styled-icons/material-rounded/ExpandMore'
import { DataTableContext } from '../DataTableContext'
import { Icon } from '../../Icon'
import { Space } from '../../Layout/Space'
import { Tooltip } from '../../Tooltip'
import { Truncate } from '../../Truncate'
import { useClickable } from '../../utils'
import { columnSize, sizeInfersTruncate } from '../Column/columnSize'
import { DataTableColumn } from '../Column'
import { FocusableCell } from '../Column/FocusableCell'

export interface DataTableHeaderCellProps extends DataTableColumn {
  className?: string
}

const DataTableHeaderCellLayout = forwardRef(
  (
    {
      canSort,
      className,
      title,
      titleIcon,
      id,
      size,
      sortDirection,
      type,
    }: DataTableHeaderCellProps,
    ref: Ref<HTMLTableHeaderCellElement>
  ) => {
    const { onSort } = useContext(DataTableContext)

    const onClick = () => {
      if (onSort && canSort) {
        onSort(id, sortDirection === 'asc' ? 'desc' : 'asc')
      }
    }
    const { role, ...clickableProps } = useClickable({ onClick })

    const label = titleIcon ? (
      <Tooltip content={title}>
        <Icon color="ui3" title={title} icon={titleIcon} size="small" />
      </Tooltip>
    ) : size && sizeInfersTruncate(size) ? (
      <Truncate width="auto">{title}</Truncate>
    ) : (
      title
    )
    return (
      <FocusableCell
        as="th"
        aria-sort={
          sortDirection === 'asc'
            ? 'ascending'
            : sortDirection === 'desc'
            ? 'descending'
            : 'none'
        }
        className={className}
        ref={ref}
        style={{ cursor: canSort ? 'pointer' : undefined }}
        {...clickableProps}
      >
        <Space gap="xxsmall" reverse={type === 'number'}>
          {label}
          {sortDirection && (
            <Icon
              icon={sortDirection === 'asc' ? <ExpandLess /> : <ExpandMore />}
              size="small"
            ></Icon>
          )}
        </Space>
      </FocusableCell>
    )
  }
)

DataTableHeaderCellLayout.displayName = 'DataTableHeaderCellLayout'

export const DataTableHeaderCell = styled(DataTableHeaderCellLayout)`
  ${columnSize}
  border-bottom: solid 1px ${(props) => props.theme.colors.ui2};
  color: ${(props) => props.theme.colors.text5};
  font-weight: ${(props) => props.theme.fontWeights.semiBold};
  text-align: left;
`
