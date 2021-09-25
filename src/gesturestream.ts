// @ts-nocheck
import flyd from 'flyd'
import flydfilter from 'flyd/module/filter'
import {
  assoc,
  dissoc,
  compose,
  values,
  filter,
  sortBy,
  take,
  map
} from 'ramda'
import flydDomEvents from 'flyd-dom-events'
import { subtract, divide } from 'mathjs'

const eventTypes = [
  'wheel',
  'pointerover',
  'pointerenter',
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointercancel',
  'pointerout'
]

// Convert 'buttons' int to an array of booleans
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
const bitmaskToArray = (int: any) => [
  !!(int & 1),
  !!(int & 2),
  !!(int & 4),
  !!(int & 8),
  !!(int & 16)
]

const updateGesture = (
  { gesture: lastGesture = {}, event: lastEvent },
  e: any
) => {
  const { touches: lastTouches, center: lastCenter } = lastGesture
  const { pointers, event } = e
  if (!event) return {} // flyd.scan emits empty value on init

  const touchList = compose(
    map(({ clientX, clientY }: any) => [clientX, clientY]),
    take(2), // Ignore 3+ finger gestures
    sortBy((event: any) => event.pointerId),
    filter((event: any) => event.pointerType === 'touch'),
    values
  )(pointers)
  const touches = touchList.length

  const getDeltaCenter = (center: any) =>
    lastCenter &&
    // Don't calculate delta if we've gone from multitouch to singletouch
    touches === lastTouches &&
    (lastEvent?.pointerType !== 'touch' || lastEvent?.type !== 'pointerout')
      ? subtract(center, lastCenter)
      : [0, 0]

  const gesture = (() => {
    const targetSize = [event.target.clientWidth, event.target.clientHeight]
    if (touches === 2) {
      const diff2 = subtract(...touchList)
      const center = subtract(touchList[0], divide(diff2, 2))
      const angle = Math.PI + Math.atan2(...diff2)
      const distance = Math.hypot(...diff2)
      return {
        targetSize,
        touches,
        center,
        buttons: bitmaskToArray((touchList[0] as any).buttons),
        deltaXY: getDeltaCenter(center),
        angle,
        deltaAngle: ((lastGesture as any).angle || angle) - angle,
        distance,
        deltaDistance: ((lastGesture as any).distance || distance) - distance
      }
    } else {
      const center = [event.clientX, event.clientY]
      const wasTap =
        event.type === 'pointerup' && lastEvent?.type === 'pointerdown'
      const buttons =
        event.type === 'pointerup' && lastEvent
          ? lastEvent.buttons
          : event.buttons
      return {
        targetSize,
        touches,
        center,
        buttons: bitmaskToArray(buttons),
        deltaXY: getDeltaCenter(center),
        wasTap
      }
    }
  })()
  return { ...e, gesture }
}

// Update the 'pointers' prop with currently active pointers
const updatePointers = ({ pointers: lastPointers }, e: any) => {
  const { event } = e
  const { pointerId, type } = event
  const pointers =
    pointerId === undefined || type === 'pointerout' || type === 'pointercancel'
      ? dissoc(pointerId, lastPointers)
      : assoc(pointerId, event, lastPointers)
  return { ...e, pointers }
}

const gesturestream = (target: any, options?: any) =>
  compose(
    flydfilter(e => (e as any).event), // flyd.scan emits empty value on init
    flyd.scan(updateGesture, {}),
    flyd.scan(updatePointers, {}),
    flyd.map(event => ({ event })),
    flydDomEvents
  )(eventTypes, target, options)

export default gesturestream
