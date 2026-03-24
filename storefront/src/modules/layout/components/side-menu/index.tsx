"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Menu: "/menu",
  Catering: "/catering",
  Locations: "/locations",
  About: "/about",
  Contact: "/contact",
  Gallery: "/gallery",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

function countSelectableCountries(
  regions: HttpTypes.StoreRegion[] | null
): number {
  if (!regions?.length) return 0
  return regions.reduce(
    (acc, r) => acc + (r.countries?.length ?? 0),
    0
  )
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const showCountrySelect = countSelectableCountries(regions) > 1

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center text-sm font-semibold uppercase tracking-wide text-brand-dark hover:text-brand-red transition-colors focus:outline-none"
                >
                  Menu
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-brand-dark/40 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-x-[-8px]"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-[-8px]"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm m-2">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-brand-dark text-brand-cream rounded-xl shadow-xl justify-between p-6 border border-brand-dark-400"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button
                        type="button"
                        data-testid="close-menu-button"
                        onClick={close}
                        className="p-1 rounded-lg hover:bg-white/10 text-brand-cream"
                        aria-label="Close menu"
                      >
                        <XMark />
                      </button>
                    </div>
                    <ul className="flex flex-col gap-4 items-start justify-start">
                      {Object.entries(SideMenuItems).map(([name, href]) => {
                        return (
                          <li key={name}>
                            <LocalizedClientLink
                              href={href}
                              className="font-display text-3xl leading-tight tracking-wide uppercase text-brand-cream hover:text-brand-yellow transition-colors"
                              onClick={close}
                              data-testid={`${name.toLowerCase()}-link`}
                            >
                              {name}
                            </LocalizedClientLink>
                          </li>
                        )
                      })}
                    </ul>
                    <div className="flex flex-col gap-y-6">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center text-brand-cream-200"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150 shrink-0",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      {showCountrySelect && regions && (
                        <div
                          className="flex justify-between items-center text-brand-cream-200"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150 shrink-0",
                              countryToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <Text className="flex justify-between txt-compact-small text-brand-cream-300">
                        © {new Date().getFullYear()} Bocanv. Empanada takeaway &
                        bar.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
