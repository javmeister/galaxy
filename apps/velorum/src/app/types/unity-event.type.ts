export interface UnityEvent {
  /**
   * The events name. It will be triggered by the name.
   * @public
   * @type {string}
   */
  eventName: string;

  /**
   * The events callback. This event will be triggered when the event is dispatched.
   * @public
   * @type {Function}
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  eventCallback: Function;
}
