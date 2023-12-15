import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import localeOptions from '@qc/template/locales'

import LogoSvg from '@qc/template/assets/logo.svg'
import ShareSvg from '@qc/icons/navigation/share.svg'
import MenuSvg from '@qc/icons/navigation/menu.svg'
import PlusSvg from '@qc/icons/navigation/plus.svg'
import LanguageSvg from '@qc/icons/navigation/language.svg'
import DropdownSvg from '@qc/icons/navigation/dropdown.svg'
import UserSvg from '@qc/icons/contents/user.svg'
import ClientsSvg from '@qc/icons/contents/group-chat.svg'
import MobileSidebar from '../../components/MobileSidebar'
import Dropdown from '../../components/Dropdown'

import { ROOT_ROUTE } from '../../constants/routes'
import useComponent from './useComponent'
import './styles.css'

export interface HeaderProps {
  toggleMenu?: VoidFunction
}

export default function Header(props: HeaderProps) {
  const { toggleMenu } = props
  const {
    store: { myAccount, onCall },
    data: {
      language,
      menuOptions,
      menuMobileOptions,
      menuSidebarOpen,
      createOptions,
      isOffline,
      matchAppointments,
    },
    handlers: {
      toggleMenuSidebarOpen,
      toggleLanguageModal,
      toggleShareLinkModal,
      handleSelectLanguage,
      selectedLanguageOption,
    },
  } = useComponent()
  const { t } = useTranslation()

  return (
    <header
      className={cn('header', {
        'header-auth': myAccount,
        'header-call': onCall,
      })}
    >
      <div className="header-nav header-nav-left">
        {matchAppointments && myAccount && toggleMenu && (
          <button
            type="button"
            className="btn clients d-hidden"
            onClick={toggleMenu}
          >
            <ClientsSvg className="icon" />
          </button>
        )}
      </div>
      <div className="logo">
        <Link to={ROOT_ROUTE}>
          <LogoSvg className="icon" />
        </Link>
        {DISPLAY_VERSION && (
          <span className="version">
            {__COMMIT_HASH__
              ? `v. ${VERSION}-${__COMMIT_HASH__}`
              : `v. ${VERSION}`}
          </span>
        )}
      </div>
      <div className="header-nav header-nav-right">
        {myAccount && Boolean(createOptions.length) && (
          <Dropdown
            className="header-dropdown dropdown-create m-hidden"
            options={createOptions}
          >
            <PlusSvg className="icon" />
            <span className="dropdown-label">{t('Create')}</span>
            <DropdownSvg className="icon icon-dropdown" />
          </Dropdown>
        )}
        {myAccount && (
          <button
            type="button"
            className="share"
            onClick={toggleShareLinkModal}
            title={t('ShareLink')}
          >
            <ShareSvg className="icon" />
            <span className="text">{t('ShareLink')}</span>
          </button>
        )}
        {HAS_CHANGE_LANGUAGE && (
          <>
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
                {selectedLanguageOption?.label}
              </span>
              <DropdownSvg className="icon icon-dropdown" />
            </Dropdown>
          </>
        )}
        {myAccount && (
          <>
            <button
              type="button"
              className="btn menu d-hidden"
              onClick={toggleMenuSidebarOpen}
            >
              <MenuSvg className="icon icon-user" />
            </button>
            <Dropdown
              className="header-dropdown dropdown-nav m-hidden"
              options={menuOptions}
            >
              <UserSvg className="icon icon-user" />
              <span className="dropdown-label">{myAccount.full_name}</span>
              <DropdownSvg className="icon icon-dropdown" />
            </Dropdown>
            <Dropdown
              className="header-dropdown dropdown-nav t-display"
              options={menuMobileOptions}
            >
              <MenuSvg className="icon" />
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
