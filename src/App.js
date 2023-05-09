import React, { useEffect, useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Bounds, OrbitControls, PerformanceMonitor, Stage } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useAnimations } from '@react-three/drei';


function Model({ modelUri }) {
  const group = useRef();
  const { scene, animations } = useLoader(GLTFLoader, modelUri);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    actions.Animation?.play();
  }, [mixer]);

  return <primitive ref={group} object={scene} dispose={null} />;
}

function ModelUploader({ onModelUpload }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const modelUri = e.target.result;
      onModelUpload(modelUri);
    };
    reader.readAsDataURL(file);
  };

  return <input type="file" accept=".glb" onChange={handleFileUpload} />;
}


function App() {
  const [modelUri, setModelUri] = useState(null);

  const handleModelUpload = (uri) => {
    setModelUri(uri);
  };

  return (
    <>
      <ModelUploader onModelUpload={handleModelUpload} />
      <Canvas
        id={modelUri}
        dpr={1}
        style={{
          height: '100vh',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)',
        }}
        camera={{ fov: 10 }}
      >
        <PerformanceMonitor>
          <pointLight color="white" intensity={1} position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Stage adjustCamera={false} intensity={0.6} shadows={false}>
              <Bounds fit clip>
                {modelUri && <Model modelUri={modelUri} />}
              </Bounds>
            </Stage>
          </Suspense>
        </PerformanceMonitor>
        <OrbitControls />
      </Canvas>
      
    </>
  );
}


export default App;
