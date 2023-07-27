import { UnityInstanceParameters } from './app/modules/unity/types/unity-instance-parameters.type';

/**
 * Type declaration for global types.
 */
declare global {
  interface Window {
    /**
     * Type declaration for the UnityWebGL Object to be used by Unity interop.
     */
    covr: {
      [contextName: string]: {
        // eslint-disable-next-line @typescript-eslint/ban-types
        [eventName: string]: Function;
      }
    };

    /**
     * Creates a new UnityInstance.
     * @param canvasHtmlElement The target html canvas element.
     * @param parameters The paramters needed to load Unity.
     * @param onProgress The on progress event listener.
     * @returns A promise resolving when instantiated successfully.
     */
    createUnityInstance: (
      canvasHtmlElement: HTMLCanvasElement,
      parameters: UnityInstanceParameters,
      onProgress?: (progression: number) => void
    ) => Promise<UnityInstance>;
  }
}

