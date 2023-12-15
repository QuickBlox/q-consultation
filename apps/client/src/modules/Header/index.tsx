import { Link, generatePath } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import localeOptions from '@qc/template/locales'

import LanguageSvg from '@qc/icons/navigation/language.svg'
import DropdownSvg from '@qc/icons/navigation/dropdown.svg'
import UserSvg from '@qc/icons/contents/user.svg'
import LogoutSvg from '@qc/icons/navigation/leave.svg'
import LogoSvg from '@qc/template/assets/logo.svg'
import Dropdown from '../../components/Dropdown'
import MobileSidebar from '../../components/MobileSidebar'
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
      toggleLogoutModal,
      toggleLanguageModal,
      toggleMenuSidebarOpen,
      handleSelectLanguage,
    },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <header className={cn('header', className, { 'header-auth': myAccount })}>
      <div className="header-nav header-nav-left" />
      <div className="logo">
        {minimalistic || isGuestAccess ? (
          <LogoSvg className="icon" />
        ) : (
          <Link to={generatePath(ROOT_ROUTE)}>
            <LogoSvg className="icon" />
          </Link>
        )}
        {DISPLAY_VERSION && !minimalistic && (
          <span className="version">
            {__COMMIT_HASH__
              ? `v. ${VERSION}-${__COMMIT_HASH__}`
              : `v. ${VERSION}`}
          </span>
        )}
      </div>
      <div className="header-nav header-nav-right">
        {HAS_CHANGE_LANGUAGE && (
          <>
            {!myAccount?.full_name && (
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
          </>
        )}
        {!minimalistic &&
          myAccount &&
          (myAccount.full_name ? (
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
                  {!minimalistic && myAccount.full_name}
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
          ) : (
            <button
              type="button"
              className="btn logout"
              onClick={toggleLogoutModal}
            >
              <LogoutSvg className="icon icon-logout" />
              <span className="logout-text">{t('Logout')}</span>
            </button>
          ))}
      </div>
    </header>
  )
}
