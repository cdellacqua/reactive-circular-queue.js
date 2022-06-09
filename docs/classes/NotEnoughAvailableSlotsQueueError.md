[reactive-circular-queue](../README.md) / NotEnoughAvailableSlotsQueueError

# Class: NotEnoughAvailableSlotsQueueError

Error that is thrown when trying to enqueue n items into a queue having an availability of m < n slots.

## Hierarchy

- `Error`

  ↳ **`NotEnoughAvailableSlotsQueueError`**

## Table of contents

### Constructors

- [constructor](NotEnoughAvailableSlotsQueueError.md#constructor)

### Properties

- [availableSlots](NotEnoughAvailableSlotsQueueError.md#availableslots)
- [message](NotEnoughAvailableSlotsQueueError.md#message)
- [name](NotEnoughAvailableSlotsQueueError.md#name)
- [requestedItems](NotEnoughAvailableSlotsQueueError.md#requesteditems)
- [stack](NotEnoughAvailableSlotsQueueError.md#stack)
- [prepareStackTrace](NotEnoughAvailableSlotsQueueError.md#preparestacktrace)
- [stackTraceLimit](NotEnoughAvailableSlotsQueueError.md#stacktracelimit)

### Methods

- [captureStackTrace](NotEnoughAvailableSlotsQueueError.md#capturestacktrace)

## Constructors

### constructor

• **new NotEnoughAvailableSlotsQueueError**(`requestedItems`, `availableSlots`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `requestedItems` | `number` |
| `availableSlots` | `number` |

#### Overrides

Error.constructor

#### Defined in

[src/lib/index.ts:140](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L140)

## Properties

### availableSlots

• **availableSlots**: `number`

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1023

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1022

___

### requestedItems

• **requestedItems**: `number`

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1024

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
