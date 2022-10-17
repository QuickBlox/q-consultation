import { useEffect, useState } from 'react'
import { LoadOptions } from 'react-select-async-paginate'
import { GroupBase, SingleValue } from 'react-select'
import { useSelector } from 'react-redux'

import { getUser } from '../../actionCreators'
import { usersListSelector } from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { AutocompleteProps } from '../../components/Autocomplete'
import { denormalize } from '../../utils/normalize'
import { createMapStateSelector } from '../../utils/selectors'
import useIsOffLine from '../../hooks/useIsOffLine'
import * as Types from '../../actions'

function getUserName(user: QBUser) {
  return user.full_name || user.login || user.email || user.phone
}

const getOption = (user: QBUser) => {
  return { value: user, label: getUserName(user) }
}

export interface UserSelectProps
  extends Pick<AutocompleteProps<unknown>, 'inputId'> {
  onChange?: (user: QBUser) => void
  filter?: (user: QBUser) => boolean
  value?: QBUser['id']
  userTag?: string | null
}

const selector = createMapStateSelector({
  users: usersListSelector,
})

export default createUseComponent((props: UserSelectProps) => {
  const { onChange, filter, value, userTag = null } = props
  const store = useSelector(selector)
  const actions = useActions({ getUser })
  const isOffline = useIsOffLine()
  const { users } = store

  const [selected, setSelected] = useState<OptionType<QBUser> | undefined>(
    undefined,
  )

  const selectOption = (option: SingleValue<OptionType<QBUser>>) => {
    if (option && (!selected || selected.value.id !== option.value.id)) {
      setSelected(option)

      if (onChange) {
        onChange(option.value)
      }
    }
  }

  const getUserOptions = (userList: QBUser[]) =>
    userList
      .filter(
        (user) =>
          user.full_name &&
          (!filter || filter(user)) &&
          (!userTag || user.user_tags?.includes(userTag)),
      )
      .map((user: QBUser) => getOption(user))

  const getUsers = (search: string, additional?: { page: number }) =>
    new Promise<Types.QBUserGetSuccessAction['payload']>((resolve) => {
      const defaultResult = {
        list: [],
        entries: {},
        current_page: 0,
        per_page: 0,
        total_entries: 0,
      }

      if (!isOffline && (search.length === 0 || search.length >= 3)) {
        actions.getUser(
          {
            page: additional?.page,
            per_page: 30,
            full_name: search,
            order: 'asc string full_name',
          },
          (
            action: Types.QBUserGetSuccessAction | Types.QBUserGetFailureAction,
          ) => {
            if (action.type === Types.QB_USER_GET_SUCCESS) {
              resolve(action.payload)
            } else {
              resolve(defaultResult)
            }
          },
        )
      } else {
        resolve(defaultResult)
      }
    })

  const loadOptions: LoadOptions<
    OptionType<QBUser>,
    GroupBase<OptionType<QBUser>>,
    { page: number }
  > = async (search, loadedOptions, additional?: { page: number }) => {
    const { list, entries, total_entries, per_page, current_page } =
      await getUsers(search, additional)

    const userList = denormalize(entries, list)

    const options = getUserOptions(userList)

    const hasMore = userList.length
      ? total_entries >= per_page * current_page
      : false

    return {
      options,
      hasMore,
      additional: {
        page: additional?.page ? additional.page + 1 : 1,
      },
    }
  }

  useEffect(() => {
    const selectedUser = users.find((user) => user.id === value)

    setSelected(selectedUser ? getOption(selectedUser) : undefined)
  }, [users])

  return {
    data: {
      selected,
    },
    handlers: {
      selectOption,
      loadOptions,
    },
  }
})
