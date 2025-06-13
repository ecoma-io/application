# Class: AppLayoutService

## Constructors

<a id="constructor"></a>

### Constructor

> **new AppLayoutService**(`sidebarNavItems`): `AppLayoutService`

#### Parameters

##### sidebarNavItems

[`IAppSidebarNavItem`](/api/angular/Interface.IAppSidebarNavItem.md)[]

#### Returns

`AppLayoutService`

## Properties

<a id="currenturl"></a>

### currentUrl

> **currentUrl**: `Signal`\<`string`\>

---

<a id="expandedmenus"></a>

### expandedMenus

> **expandedMenus**: `Signal`\<`Set`\<`string`\>\>

---

<a id="sidebarcollapsed"></a>

### sidebarCollapsed

> **sidebarCollapsed**: `Signal`\<`boolean`\>

---

<a id="sidebaropen"></a>

### sidebarOpen

> **sidebarOpen**: `Signal`\<`boolean`\>

## Methods

<a id="closeallmenus"></a>

### closeAllMenus()

> **closeAllMenus**(): `void`

#### Returns

`void`

---

<a id="closesidebar"></a>

### closeSidebar()

> **closeSidebar**(): `void`

#### Returns

`void`

---

<a id="ismenuexpanded"></a>

### isMenuExpanded()

> **isMenuExpanded**(`menuId`): `boolean`

#### Parameters

##### menuId

`string`

#### Returns

`boolean`

---

<a id="ismenuitemactive"></a>

### isMenuItemActive()

> **isMenuItemActive**(`route?`): `boolean`

Check if a menu item should be active based on current URL

#### Parameters

##### route?

`string`

#### Returns

`boolean`

---

<a id="isparentmenuactive"></a>

### isParentMenuActive()

> **isParentMenuActive**(`children?`): `boolean`

Check if a parent menu should be active (has active children)

#### Parameters

##### children?

`any`[]

#### Returns

`boolean`

---

<a id="refreshmenustate"></a>

### refreshMenuState()

> **refreshMenuState**(): `void`

Force update menu state (useful for manual refresh)

#### Returns

`void`

---

<a id="setcollapsedstate"></a>

### setCollapsedState()

> **setCollapsedState**(`collapsed`): `void`

#### Parameters

##### collapsed

`boolean`

#### Returns

`void`

---

<a id="setsidebarstate"></a>

### setSidebarState()

> **setSidebarState**(`open`): `void`

#### Parameters

##### open

`boolean`

#### Returns

`void`

---

<a id="togglecollapse"></a>

### toggleCollapse()

> **toggleCollapse**(): `void`

#### Returns

`void`

---

<a id="togglemenu"></a>

### toggleMenu()

> **toggleMenu**(`menuId`): `void`

#### Parameters

##### menuId

`string`

#### Returns

`void`

---

<a id="togglesidebar"></a>

### toggleSidebar()

> **toggleSidebar**(): `void`

#### Returns

`void`
