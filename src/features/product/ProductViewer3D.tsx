import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Center,
  RoundedBox,
  ContactShadows,
} from "@react-three/drei";
import { Suspense } from "react";

type ProductViewer3DProps = {
  color: string;
};

type WatchModelProps = {
  color: string;
};

function WatchModel({ color }: WatchModelProps) {
  return (
    <Center>
      <group rotation={[0.15, -0.35, 0]}>
        <RoundedBox
          args={[2.45, 2.9, 0.62]}
          radius={0.35}
          smoothness={6}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color="#b8bcc4"
            metalness={0.8}
            roughness={0.22}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        <RoundedBox
          args={[2.08, 2.52, 0.12]}
          radius={0.28}
          smoothness={6}
          position={[0, 0, 0.38]}
          castShadow
        >
          <meshStandardMaterial
            color="#07070b"
            metalness={0.35}
            roughness={0.14}
          />
        </RoundedBox>

        <RoundedBox
          args={[1.18, 1.75, 0.24]}
          radius={0.18}
          smoothness={5}
          position={[0, 2.25, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            metalness={0.45}
            roughness={0.32}
          />
        </RoundedBox>

        <RoundedBox
          args={[1.18, 1.75, 0.24]}
          radius={0.18}
          smoothness={5}
          position={[0, -2.25, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial
            color={color}
            metalness={0.45}
            roughness={0.32}
          />
        </RoundedBox>

        <mesh
          position={[1.38, 0.65, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.2, 0.2, 0.28, 32]} />
          <meshStandardMaterial
            color="#a6aab2"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[1.38, 0, 0]} castShadow>
          <sphereGeometry args={[0.11, 20, 12]} />
          <meshStandardMaterial
            color="#a6aab2"
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Center>
  );
}

export default function ProductViewer3D({
  color,
}: ProductViewer3DProps) {
  return (
    <div className="product-viewer-3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 7],
          fov: 35,
        }}
        gl={{
          antialias: true,
        }}
      >
        {/* Base lighting */}
        <ambientLight intensity={1.2} />

        {/* Main light */}
        <directionalLight
          position={[5, 6, 5]}
          intensity={3}
          castShadow
        />

        {/* Fill light */}
        <directionalLight
          position={[-5, 3, 4]}
          intensity={2}
        />

        {/* Neutral product lighting */}
        <pointLight
          position={[3, 2, 4]}
          intensity={2.5}
          color="#ffffff"
        />

        <pointLight
          position={[-3, -2, 2]}
          intensity={1.5}
          color="#a1a1a1"
        />

        <Suspense fallback={null}>
          <WatchModel color={color} />

          <Environment preset="city" />

          <ContactShadows
            position={[0, -2.8, 0]}
            opacity={0.5}
            scale={8}
            blur={2.5}
            far={5}
          />
        </Suspense>

        {/* Mouse drag to rotate */}
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={4}
          maxDistance={10}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}