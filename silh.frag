#version 120

varying vec3 vN;  // Matches vertex shader
varying vec3 vL;
varying vec3 vE;

uniform bool uSilh;
uniform bool uSurface;
uniform float uTol;
uniform vec3 uColor;


const vec3 	Color =		vec3( 0., 1., 0.8 );
const float	Ka =		0.1;
const float	Kd =		0.6;
const float	Ks =		0.3;
const float	Shininess =	30.;
const vec3	SpecularColor =	vec3( 1.0, 1.0, 1.0 );
const vec3	SilhColor =	vec3( 1.0, 0.5, 0.0 );

void
main()
{
	vec3 myColor = Color;

// per-fragment lighting:

	vec3 Normal    = normalize(vN);
	vec3 Light     = normalize(vL);
	vec3 Eye       = normalize(vE);

	vec3 ambient = Ka * myColor;

	float d = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
	vec3 diffuse = Kd * d * myColor;

	float s = 0.;
	if( d > 0. )	          // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		float cosphi = dot( Eye, ref );
		if( cosphi > 0. )
			s = pow( max( cosphi, 0. ), Shininess );
	}
	vec3 specular = Ks * s * SpecularColor;

// all the silhouette stuff happens below here:

	// Check if fragment is on silhouette edge
	// When dot(Normal, Eye) is close to 0, we're looking at the edge
	float dotNE = abs( dot(Normal, Eye) );
	
	if( uSilh && dotNE < uTol )
	{
		// This fragment is on the silhouette edge - draw silhouette color
		gl_FragColor = vec4( SilhColor, 1. );
	}
	else
	{
		if( uSurface )

			gl_FragColor = vec4( ambient + diffuse + specular,  1. );
		else
			discard;
	}
}