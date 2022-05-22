[reactive-circular-queue](../README.md) / NotEnoughFilledSlotsQueueError

# Class: NotEnoughFilledSlotsQueueError

Error that is thrown when trying to dequeue n items from a queue containing m < n items.

## Hierarchy

- `Error`

  ↳ **`NotEnoughFilledSlotsQueueError`**

## Table of contents

### Constructors

- [constructor](NotEnoughFilledSlotsQueueError.md#constructor)

### Properties

- [filledSlots](NotEnoughFilledSlotsQueueError.md#filledslots)
- [message](NotEnoughFilledSlotsQueueError.md#message)
- [name](NotEnoughFilledSlotsQueueError.md#name)
- [requestedItems](NotEnoughFilledSlotsQueueError.md#requesteditems)
- [stack](NotEnoughFilledSlotsQueueError.md#stack)
- [prepareStackTrace](NotEnoughFilledSlotsQueueError.md#preparestacktrace)
- [stackTraceLimit](NotEnoughFilledSlotsQueueError.md#stacktracelimit)

### Methods

- [captureStackTrace](NotEnoughFilledSlotsQueueError.md#capturestacktrace)

## Constructors

### constructor

• **new NotEnoughFilledSlotsQueueError**(`requestedItems`, `filledSlots`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `requestedItems` | `number` |
| `filledSlots` | `number` |

#### Overrides

Error.constructor

#### Defined in

[src/lib/index.ts:119](https://github.com/cdellacqua/reactive-circular-queue.js/blob/main/src/lib/index.ts#L119)

## Properties

### filledSlots

• **filledSlots**: `number`

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
