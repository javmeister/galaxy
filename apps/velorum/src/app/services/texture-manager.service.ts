import { Injectable } from '@angular/core';
import { LinearEncoding, LinearFilter, LinearMipMapLinearFilter } from 'three/src/constants';
import { CubeTexture } from 'three/src/textures/CubeTexture';

@Injectable({
  providedIn: 'root',
})
export class TextureManagerService {
  private name = 'TextureManagerService';

  // Internal flag
  public galaxySkybox!: CubeTexture;

  public LoadSkyboxCubeTexturesFromHTMLImages() {
    const dramaticBloomPxImage: HTMLImageElement = document.querySelector('#dramatic-bloom-px') as HTMLImageElement;
    const dramaticBloomNxImage: HTMLImageElement = document.querySelector('#dramatic-bloom-nx') as HTMLImageElement;
    const dramaticBloomPyImage: HTMLImageElement = document.querySelector('#dramatic-bloom-py') as HTMLImageElement;
    const dramaticBloomNyImage: HTMLImageElement = document.querySelector('#dramatic-bloom-ny') as HTMLImageElement;
    const dramaticBloomPzImage: HTMLImageElement = document.querySelector('#dramatic-bloom-pz') as HTMLImageElement;
    const dramaticBloomNzImage: HTMLImageElement = document.querySelector('#dramatic-bloom-nz') as HTMLImageElement;

    this.galaxySkybox = new CubeTexture();

    this.galaxySkybox.generateMipmaps = false;
    this.galaxySkybox.encoding = LinearEncoding;
    this.galaxySkybox.minFilter = LinearMipMapLinearFilter;
    this.galaxySkybox.magFilter = LinearFilter;
    this.galaxySkybox.images = [
      dramaticBloomPxImage,
      dramaticBloomNxImage,
      dramaticBloomPyImage,
      dramaticBloomNyImage,
      dramaticBloomPzImage,
      dramaticBloomNzImage
    ];
    this.galaxySkybox.needsUpdate = true;

  }

  public dispose(): void {
    // Anything to dispose?
  }
}
