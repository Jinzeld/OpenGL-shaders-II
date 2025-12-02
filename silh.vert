#version 120

varying vec3 vN;
varying vec3 vL;
varying vec3 vE;

uniform vec4 uLightPosition;

void
main()
{
	vN = normalize( gl_NormalMatrix * gl_Normal );	// normal vector

	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;

	vL = uLightPosition.xyz - ECposition.xyz;		// FIXED: was 'LightPosition', now 'uLightPosition'

	vE = vec3( 0., 0., 0. ) - ECposition.xyz;	// vector from the point to the eye position 

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}