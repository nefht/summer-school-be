import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';

import { Chevron } from 'payload/components/icons';
import { useNav } from 'payload/components/elements';
import { usePreferences } from 'payload/components/preferences';

import { HiCog, HiMap } from 'react-icons/hi';

const baseClass = 'nav-group';

const iconDictionary = {
  'Điều hướng': <HiMap />,
  'Quản lý': <HiCog />,
};

const NavGroup = ({ children, label }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [animate, setAnimate] = useState(false);
  const { getPreference, setPreference } = usePreferences();
  const { navOpen } = useNav();

  const preferencesKey = `collapsed-${label}-groups`;

  useEffect(() => {
    if (label) {
      const setCollapsedFromPreferences = async () => {
        const preferences = (await getPreference(preferencesKey)) || [];
        setCollapsed(preferences.indexOf(label) !== -1);
      };
      setCollapsedFromPreferences();
    }
  }, [getPreference, label, preferencesKey]);

  if (label) {
    const toggleCollapsed = async () => {
      setAnimate(true);
      let preferences = (await getPreference(preferencesKey)) || [];
      if (collapsed) {
        preferences = preferences.filter((preference) => label !== preference);
      } else {
        preferences.push(label);
      }
      setPreference(preferencesKey, preferences);
      setCollapsed(!collapsed);
    };

    return (
      <div
        className={[
          `${baseClass}`,
          `${label}`,
          collapsed && `${baseClass}--collapsed`,
        ]
          .filter(Boolean)
          .join(' ')}
        id={`nav-group-${label}`}
      >
        <button
          className={[
            `${baseClass}__toggle`,
            `${baseClass}__toggle--${collapsed ? 'collapsed' : 'open'}`,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={toggleCollapsed}
          tabIndex={!navOpen ? -1 : 0}
          type="button"
          style={{
            color: '#0b7077',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div style={{ color: '#0b7077', fontSize: '16px' }}>
            {iconDictionary[label]}
          </div>
          <div
            className={`${baseClass}__label`}
            style={{ color: '#0b7077', fontWeight: '700', fontSize: '16px' }}
          >
            {label}
          </div>
          <div
            className={`${baseClass}__indicator`}
            style={{ color: '#0b7077', fontWeight: '700' }}
          >
            <Chevron
              className={`${baseClass}__indicator`}
              direction={!collapsed ? 'up' : undefined}
              style={{ color: '#0b7077' }}
            />
          </div>
        </button>
        <AnimateHeight
          duration={animate ? 200 : 0}
          height={collapsed ? 0 : 'auto'}
        >
          <div className={`${baseClass}__content`}>{children}</div>
        </AnimateHeight>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default NavGroup;
