import { Link, generatePath } from 'react-router-dom'
import cn from 'classnames'

import { LogoSvg, LanguageSvg, DropdownSvg, UserSvg } from '../../icons'
import Dropdown from '../../components/Dropdown'
import MobileSidebar from '../../components/MobileSidebar'
import { localeOptions } from '../../constants/locale'
import { ROOT_ROUTE } from '../../constants/routes'
import useComponent from './useComponent'
import './styles.css'

interface HeaderProps {
  className?: string
  minimalistic?: boolean
}

export default function Header(props: HeaderProps) {
  const { className, minimalistic } = props
  const {
    store: { myAccount },
    data: {
      language,
      menuOptions,
      menuMobileOptions,
      menuSidebarOpen,
      selectedLanguageOption,
      isOffline,
      isGuestAccess,
    },
    handlers: {
      toggleLanguageModal,
      toggleMenuSidebarOpen,
      handleSelectLanguage,
    },
  } = useComponent()
  const userName =
    myAccount?.full_name ||
    myAccount?.login ||
    myAccount?.phone ||
    myAccount?.email

  return (
    <header className={cn('header', className, { 'header-auth': myAccount })}>
      <div className="header-nav header-nav-left" />
      <div className="logo">
        {isGuestAccess ? (
          <LogoSvg className="icon" />
        ) : (
          <Link to={generatePath(ROOT_ROUTE)}>
            <LogoSvg className="icon" />
          </Link>
        )}
      </div>
      <div className="header-nav header-nav-right">
        {!myAccount && (
          <button
            type="button"
            className="btn lang d-hidden"
            onClick={toggleLanguageModal}
          >
            <LanguageSvg className="icon icon-lang" />
          </button>
        )}
        <Dropdown
          className="header-dropdown dropdown-lang m-hidden"
          value={language}
          onSelect={handleSelectLanguage}
          options={localeOptions}
          disabled={isOffline}
        >
          <LanguageSvg className="icon icon-lang" />
          <span className="dropdown-label">
            {!minimalistic && selectedLanguageOption?.label}
          </span>
          <DropdownSvg className="icon icon-dropdown" />
        </Dropdown>
        {myAccount && userName && (
          <>
            <button
              type="button"
              className="btn user d-hidden"
              onClick={toggleMenuSidebarOpen}
            >
              <UserSvg className="icon icon-user" />
            </button>
            <Dropdown
              className="header-dropdown dropdown-nav m-hidden"
              options={menuOptions}
            >
              <UserSvg className="icon icon-user" />
              <span className="dropdown-label">
                {!minimalistic && userName}
              </span>
              <DropdownSvg className="icon icon-dropdown" />
            </Dropdown>
            <MobileSidebar
              position="right"
              open={menuSidebarOpen}
              onClose={toggleMenuSidebarOpen}
            >
              <ul className="header-menu">
                {menuMobileOptions.map(
                  (option, index) =>
                    !option.hide && (
                      <li
                        key={index}
                        className={cn('menu-item', {
                          'menu-item-divider': option.divider,
                        })}
                      >
                        {option.label &&
                          (option.path ? (
                            <Link
                              className="menu-item-text"
                              to={option.path}
                              onClick={toggleMenuSidebarOpen}
                            >
                              {option.label}
                            </Link>
                          ) : (
                            <span
                              className="menu-item-text"
                              onClick={() => {
                                toggleMenuSidebarOpen()

                                if (option.onClick) {
                                  option.onClick()
                                }
                              }}
                            >
                              {option.label}
                            </span>
                          ))}
                      </li>
                    ),
                )}
              </ul>
            </MobileSidebar>
          </>
        )}
      </div>
    </header>
  )
}
