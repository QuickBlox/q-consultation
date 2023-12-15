import { Link } from 'react-router-dom'
import cn from 'classnames'

import useComponent, { DropdownProps } from './useComponent'
import './styles.css'

export default function Dropdown(props: DropdownProps) {
  const { className, children, options, value } = props
  const {
    refs: { dropdownRef },
    data: { isOpen, disabled },
    handlers: { handleToggleOpen, handleSelectCreator },
  } = useComponent(props)

  return (
    <div ref={dropdownRef} className={cn('dropdown', className)}>
      <button
        type="button"
        className="dropdown-toggle"
        onClick={handleToggleOpen}
      >
        {children}
      </button>
      <ul className={cn('dropdown-menu', { open: isOpen })}>
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
                    <Link
                      className="dropdown-item-text"
                      to={option.path}
                      state={
                        typeof option.path === 'object'
                          ? option.path.state
                          : null
                      }
                    >
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
