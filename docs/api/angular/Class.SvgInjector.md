# Class: SvgInjector

## Implements

- `OnChanges`

## Constructors

<a id="constructor"></a>

### Constructor

> **new SvgInjector**(`el`, `iconService`): `SvgInjector`

#### Parameters

##### el

`ElementRef`

##### iconService

[`SvgInjectorService`](/api/angular/Class.SvgInjectorService.md)

#### Returns

`SvgInjector`

## Properties

<a id="inserted"></a>

### inserted

> **inserted**: `EventEmitter`\<`void`\>

---

<a id="path"></a>

### path

> **path**: `string`

## Methods

<a id="initsource"></a>

### initSource()

> **initSource**(): `void`

#### Returns

`void`

---

<a id="ngonchanges"></a>

### ngOnChanges()

> **ngOnChanges**(): `void`

A callback method that is invoked immediately after the
default change detector has checked data-bound properties
if at least one has changed, and before the view and content
children are checked.

#### Returns

`void`

#### Implementation of

`OnChanges.ngOnChanges`
