import { Link } from 'react-router-dom'
import cn from 'classnames'

import useComponent, { DropdownProps } from './useComponent'
import './styles.css'

export default function Dropdown(props: DropdownProps) {
  const { className, children, options, value } = props
  const {
    refs: { listRef },
    data: { isOpen, disabled },
    handlers: { handleToggleOpen, handleSelectCreator },
  } = useComponent(props)

  return (
    <div className={cn('dropdown', className)}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={handleToggleOpen}
      >
        {children}
      </button>
      <ul ref={listRef} className={cn('dropdown-menu', { open: isOpen })}>
        {options.map(
          (option, index) =>
            !option.hide && (
              <li
                key={option.value || index}
                className={cn('dropdown-item', {
                  'dropdown-item-divider': option.divider,
                  active: value && value === option.value,
                  disabled,
                })}
                onClick={handleSelectCreator(option)}
              >
                {option.label &&
                  (option.path ? (
                    <Link className="dropdown-item-text" to={option.path}>
                      {option.label}
                    </Link>
                  ) : (
                    <span className="dropdown-item-text">{option.label}</span>
                  ))}
              </li>
            ),
        )}
      </ul>
    </div>
  )
}
