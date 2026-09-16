import React from 'react';
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react';

class ShaderErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn('ShaderGradient WebGL initialization error:', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const SmokeShaderBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Underlying deep dark theme gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05050B] via-[#030307] to-[#0A0A12]" />

      {/* WebGL Shader Gradient Canvas */}
      <div className="absolute inset-0 opacity-80 mix-blend-screen">
        <ShaderErrorBoundary>
          <ShaderGradientCanvas
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
            pointerEvents="none"
            pixelDensity={1}
          >
            <ShaderGradient
              control="query"
              urlString="https://www.shadergradient.co/customize?animate=on&axes=both&bgColor1=%23000000&bgColor2=%2305050c&brightness=1.15&cAzimuthAngle=180&cDistance=3.5&cPolarAngle=90&cameraZoom=1&color1=%23005BFF&color2=%237B16FF&color3=%23030308&destination=onStart&embedMode=off&env=on&format=react&fov=45&frame=fixed&grain=on&lightType=3d&model=plane&noiseDensity=1.6&noiseStrength=3.5&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.15&rotationX=0&rotationY=0&rotationZ=0&shader=defaults&speed=0.06&type=waterPlane&uAmplitude=0.4&uDensity=1.6&uFrequency=5.5&uSpeed=0.18&wireframe=false"
            />
          </ShaderGradientCanvas>
        </ShaderErrorBoundary>
      </div>

      {/* Atmospheric Smoke and Glow Effects */}
      <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-accent-blue/15 rounded-full blur-[140px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-accent-purple/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Subtle vignette and bottom contrast overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
