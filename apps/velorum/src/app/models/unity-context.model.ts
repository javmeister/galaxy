import { UnityConfig } from '../types/unity-config.type';
import { UnityEvent } from '../types/unity-event.type';
import { UnityContextEventMap } from '../types/unity-context-event-map.type';
import '../extensions/string.extensions';

/**
 * The Unity Context.
 */
export class UnityContext {
  /**
   * A reference to the Unity Instance binded to this unityContext.
   * @private
   * @type {UnityInstance}
   */
  private unityInstance?: UnityInstance;

  /**
   * A list of the UnityEvents binded to this unityContext.
   * @private
   * @type {UnityEvent[]}
   */
  private unityEvents: UnityEvent[] = [];

  /**
   * Creates a new instance of the Unity context model.
   * @param string name The context name, this will be added to the window object to allow for multiple contexts.
   * @param {UnityConfig} unityConfig The Unity config used to build the player.
   */
  constructor(public name: string, public unityConfig: UnityConfig) {
    if (
      typeof window !== 'undefined' &&
      typeof window.covr === 'undefined'
    )
      window.covr = {};

      // Add the context
      window.covr[name] = {};

      // Add the emit() event handler triggered from Unity
      window.covr[name]['emit'] = (eventName: string, eventValue?: any): void => {
        this.dispatchEventListener(eventName, eventValue);
      };
  }

  /**
   * Sets the reference of the UnityInstance.
   * @public
   * @param {UnityInstance} unityInstance the target unityInstance.
   */
  public setUnityInstance(unityInstance: UnityInstance): void {
    this.unityInstance = unityInstance;
  }

  /**
   * Quits the Unity Instance and clears it from memory.
   * @public
   */
  public async quitUnityInstance(): Promise<boolean> {
    if (typeof this.unityInstance !== 'undefined') {
      await this.unityInstance.Quit();
      this.dispatchEventListener('quitted');
      this.unityInstance = undefined;
      return true;
    }
    return true;
  }

  /**
   * Sends a message to the UnityInstance to invoke a public method.
   * @public
   * @param {string} gameObjectName the name of the game object in your Unity scene.
   * @param {string} methodName the name of the public method on the game object.
   * @param {string | number | boolean} parameter an optional method parameter.
   */
  public send(
    gameObjectName: string,
    methodName: string,
    parameter?: string | number | boolean
  ): void {
    if (typeof this.unityInstance !== 'undefined') {
      if (typeof parameter === 'undefined') {
        this.unityInstance.SendMessage(gameObjectName, methodName);
      } else {
        this.unityInstance.SendMessage(gameObjectName, methodName, parameter);
      }
    }
  }

  /**
   * Registers an event listener for the Unity player. These can be
   * system events like when the player is initialized or loader and
   * your custom events from Unity.
   * @public
   * @param {string} eventName the event's name
   * @param {Function} eventListener the event's function
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public on<MapKey extends keyof UnityContextEventMap | (string & {})>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    eventName: keyof UnityContextEventMap | (MapKey & {}),
    eventListener: (
      ...parameters: MapKey extends keyof UnityContextEventMap
        ? UnityContextEventMap[MapKey]
        : any
    ) => void
  ): void {
    this.unityEvents.push({ eventName: eventName.slug(), eventCallback: eventListener });
    if (typeof window !== 'undefined') {
      const sluggedEventName = eventName.slug();

      window.covr[this.name][sluggedEventName] = (...parameters: any) =>
        eventListener(...parameters);

    }
  }

  /**
   * Removes all the Event Listeners with a specific Event Name.
   * @public
   * @param {string} eventName the event's name
   * @example unityContext.removeEventListener("progress");
   */
  public removeEventListener(eventName: string): void {
    // TODO refactor to "off"?
    for (let _i = 0; _i < this.unityEvents.length; _i++)
      if (this.unityEvents[_i].eventName === eventName)
        this.unityEvents.splice(_i, 1);
    delete window.covr[this.name][eventName];
  }

  /**
   * Removes all the Event Listeners.
   * @public
   * @example unityContext.removeAllEventListeners();
   */
  public removeAllEventListeners(): void {
    // TODO refactor to "off"?
    for (let _i = 0; _i < this.unityEvents.length; _i++)
      delete window.covr[this.name][this.unityEvents[_i].eventName];
    this.unityEvents = [];
  }

  /**
   * Dispatches an event listener that has been registered using the on method.
   * @public
   * @param {string} eventName the event's name
   * @param {any} eventValue the event's value
   * @example unityContext.dispatchEventListener("gameOver", 180);
   */
  public dispatchEventListener(eventName: string, eventValue?: any): void {
    for (const _unityEvent of this.unityEvents) {
      if (_unityEvent.eventName === eventName.slug()) {
        _unityEvent.eventCallback(eventValue);
      }
    }
  }

  /**
   * Enables or disabled the Fullscreen mode of the Unity Instance.
   * @public
   * @param {boolean} enabled
   */
  public setFullscreen(enabled: boolean): void {
    if (typeof this.unityInstance !== 'undefined')
      this.unityInstance.SetFullscreen(enabled === true ? 1 : 0);
  }
}
