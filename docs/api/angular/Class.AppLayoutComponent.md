# Class: AppLayoutComponent

## Implements

- `OnInit`

## Constructors

<a id="constructor"></a>

### Constructor

> **new AppLayoutComponent**(`sidebarNavItems`, `domain`, `layoutService`): `AppLayoutComponent`

#### Parameters

##### sidebarNavItems

[`IAppSidebarNavItem`](/api/angular/Interface.IAppSidebarNavItem.md)[]

##### domain

[`Domains`](/api/angular/Class.Domains.md)

##### layoutService

[`AppLayoutService`](/api/angular/Class.AppLayoutService.md)

#### Returns

`AppLayoutComponent`

## Properties

<a id="iconsbaseurl"></a>

### iconsBaseUrl

> **iconsBaseUrl**: `string`

---

<a id="ishovered"></a>

### isHovered

> **isHovered**: `boolean` = `false`

---

<a id="issmallscreen"></a>

### isSmallScreen

> **isSmallScreen**: `boolean` = `false`

---

<a id="layoutservice"></a>

### layoutService

> `protected` **layoutService**: [`AppLayoutService`](/api/angular/Class.AppLayoutService.md)

---

<a id="navitems"></a>

### navItems

> **navItems**: [`IAppSidebarNavItem`](/api/angular/Interface.IAppSidebarNavItem.md)[]

## Methods

<a id="iconurl"></a>

### iconUrl()

> **iconUrl**(`path`): `string`

Create full url of icon with icon path

#### Parameters

##### path

`string`

the path of icon

#### Returns

`string`

full url of icon

---

<a id="ngoninit"></a>

### ngOnInit()

> **ngOnInit**(): `void`

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

---

<a id="onmenuitemclick"></a>

### onMenuItemClick()

> **onMenuItemClick**(): `void`

#### Returns

`void`

---

<a id="onmouseenter"></a>

### onMouseEnter()

> **onMouseEnter**(): `void`

#### Returns

`void`

---

<a id="onmouseleave"></a>

### onMouseLeave()

> **onMouseLeave**(): `void`

#### Returns

`void`

---

<a id="onresize"></a>

### onResize()

> **onResize**(): `void`

#### Returns

`void`

---

<a id="togglesubmenu"></a>

### toggleSubmenu()

> **toggleSubmenu**(`menuId`): `void`

#### Parameters

##### menuId

`string`

#### Returns

`void`
