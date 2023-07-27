
import { NoBlending } from "three/src/constants";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute";
import { BufferGeometry } from "three/src/core/BufferGeometry";
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial";
import { Color } from "three/src/math/Color";
import { LineSegments } from "three/src/objects/LineSegments";


export class PolarGridHelper extends LineSegments {

	constructor( radius = 10, sectors = 16, rings = 8, divisions = 64, color1 = 0x444444, color2 = 0x888888, opacity = 0.5 ) {

		const _color1 = new Color( color1 );
		const _color2 = new Color( color2 );

    let _color = _color1;

		const vertices = [];
		const colors = [];

		// create the sectors

		if ( sectors > 1 ) {

			for ( let i = 0; i < sectors; i ++ ) {

				const v = ( i / sectors ) * ( Math.PI * 2 );

				const x = Math.sin( v ) * radius;
				const z = Math.cos( v ) * radius;

				vertices.push( 0, 0, 0 );
				vertices.push( x, 0, z );

				_color = ( i & 1 ) ? _color1 : _color2;

				colors.push( _color.r, _color.g, _color.b );
				colors.push( _color.r, _color.g, _color.b );

			}

		}

		// create the rings

		for ( let i = 0; i < rings; i ++ ) {

			_color = ( i & 1 ) ? _color1 : _color2;

			const r = radius - ( radius / rings * i );

			for ( let j = 0; j < divisions; j ++ ) {

				// first vertex

				let v = ( j / divisions ) * ( Math.PI * 2 );

				let x = Math.sin( v ) * r;
				let z = Math.cos( v ) * r;

				vertices.push( x, 0, z );
				colors.push( _color.r, _color.g, _color.b );

				// second vertex

				v = ( ( j + 1 ) / divisions ) * ( Math.PI * 2 );

				x = Math.sin( v ) * r;
				z = Math.cos( v ) * r;

				vertices.push( x, 0, z );
				colors.push( _color.r, _color.g, _color.b );

			}

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

		const material = new LineBasicMaterial({
      vertexColors: true,
      // toneMapped: true,
      // blending: NoBlending,
      transparent: true,
      opacity
    });

		super( geometry, material );

		this.type = 'PolarGridHelper';
	}

	dispose() {

		this.geometry.dispose();
		(this.material as LineBasicMaterial).dispose();

	}

}

