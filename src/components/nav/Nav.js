import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

import { useNav } from 'payload/components/elements';
import Logout from 'payload/dist/admin/components/elements/Logout';
import { useAuth, useConfig } from 'payload/components/utilities';
import { Chevron } from 'payload/components/icons';
import { getTranslation } from 'payload/dist/utilities/getTranslation';

import NavGroup from './NavGroup';
import { Hamburger } from './Hamburger';

const baseClass = 'nav';

export function groupNavItems(entities, permissions, i18n) {
  console.log('Entities to Group:', entities);
  console.log('Permissions:', permissions);

  const result = entities.reduce(
    (groups, entityToGroup) => {
      const permission =
        permissions[entityToGroup.type.toLowerCase()]?.[
          entityToGroup.entity.slug
        ]?.read?.permission;
      console.log(
        `Checking permission for ${entityToGroup.entity.slug}:`,
        permission,
      );

      if (
        true
        // if (
        //   permissions?.[entityToGroup.type.toLowerCase()]?.[
        //     entityToGroup.entity.slug
        //   ]?.read.permission
      ) {
        const translatedGroup = getTranslation(
          entityToGroup.entity.admin.group,
          i18n,
        );
        console.log(
          `Translated group for ${entityToGroup.entity.slug}:`,
          translatedGroup,
        );
        if (entityToGroup.entity.admin.group) {
          const existingGroup = groups.find(
            (group) => getTranslation(group.label, i18n) === translatedGroup,
          );
          let matchedGroup = existingGroup;
          if (!existingGroup) {
            matchedGroup = { entities: [], label: translatedGroup };
            groups.push(matchedGroup);
          }

          matchedGroup.entities.push(entityToGroup);
        } else {
          const defaultGroup = groups.find(
            (group) =>
              getTranslation(group.label, i18n) ===
              i18n.t(`general:${entityToGroup.type}`),
          );
          defaultGroup.entities.push(entityToGroup);
        }
      }

      return groups;
    },
    [
      {
        entities: [],
        label: i18n.t('general:collections'),
      },
      {
        entities: [],
        label: i18n.t('general:globals'),
      },
    ],
  );

  console.log('Grouped Nav Items:', result);
  return result.filter((group) => group.entities.length > 0);
}

export default function Nav() {
  const { navOpen, navRef, setNavOpen } = useNav();
  const { permissions, user } = useAuth();
  const [groups, setGroups] = useState([]);
  const { i18n } = useTranslation('general');

  const EntityType = {
    collection: 'collection',
    global: 'global',
  };

  const {
    admin: {
      components: { afterNavLinks, beforeNavLinks },
    },
    collections,
    globals,
    routes: { admin },
  } = useConfig();

  useEffect(() => {
    setGroups(
      groupNavItems(
        [
          ...collections
            .filter(
              ({ admin: { hidden } }) =>
                !(typeof hidden === 'function' ? hidden({ user }) : hidden),
            )
            .map((collection) => {
              const entityToGroup = {
                entity: collection,
                type: EntityType.collection,
              };

              return entityToGroup;
            }),
          ...globals
            .filter(
              ({ admin: { hidden } }) =>
                !(typeof hidden === 'function' ? hidden({ user }) : hidden),
            )
            .map((global) => {
              const entityToGroup = {
                entity: global,
                type: EntityType.global,
              };

              return entityToGroup;
            }),
        ],
        permissions,
        i18n,
      ),
    );
  }, [collections, globals, permissions, i18n, i18n.language, user]);

  return (
    <aside
      className={[baseClass, navOpen && `${baseClass}--nav-open`]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`${baseClass}__scroll`} ref={navRef}>
        <nav className={`${baseClass}__wrap`}>
          {Array.isArray(beforeNavLinks) &&
            beforeNavLinks.map((Component, i) => <Component key={i} />)}
          <NavGroup label="Điều hướng">
            {/* <a
              href={process.env.FRONTEND_SERVER_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Summer School
            </a> */}
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
            >
              Summer School
            </a>
            <Link to="/admin">Dashboard</Link>
          </NavGroup>
          {groups.map(({ entities, label }, key) => {
            return (
              <NavGroup {...{ key, label }}>
                {entities.map(({ entity, type }, i) => {
                  let entityLabel;
                  let href;
                  let id;

                  if (type === EntityType.collection) {
                    href = `${admin}/collections/${entity.slug}`;
                    entityLabel = getTranslation(entity.labels.plural, i18n);
                    id = `nav-${entity.slug}`;
                  }

                  if (type === EntityType.global) {
                    href = `${admin}/globals/${entity.slug}`;
                    entityLabel = getTranslation(entity.label, i18n);
                    id = `nav-global-${entity.slug}`;
                  }

                  return (
                    <NavLink
                      activeClassName="active"
                      className={`${baseClass}__link`}
                      id={id}
                      key={i}
                      tabIndex={!navOpen ? -1 : undefined}
                      to={href}
                    >
                      <span className={`${baseClass}__link-icon`}>
                        <Chevron direction="right" />
                      </span>
                      <span className={`${baseClass}__link-label`}>
                        {entityLabel}
                      </span>
                    </NavLink>
                  );
                })}
              </NavGroup>
            );
          })}

          {Array.isArray(afterNavLinks) &&
            afterNavLinks.map((Component, i) => <Component key={i} />)}
          <div className={`${baseClass}__controls`}>
            <Logout tabIndex={!navOpen ? -1 : undefined} />
          </div>
        </nav>
      </div>
      <div className={`${baseClass}__header`}>
        <div className={`${baseClass}__header-content`}>
          <button
            className={`${baseClass}__mobile-close`}
            onClick={() => {
              setNavOpen(false);
            }}
            tabIndex={!navOpen ? -1 : undefined}
            type="button"
          >
            <Hamburger isActive />
          </button>
        </div>
      </div>
    </aside>
  );
}
