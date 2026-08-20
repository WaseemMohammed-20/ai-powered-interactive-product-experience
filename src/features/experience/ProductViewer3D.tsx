import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Float,
  OrbitControls,
  RoundedBox,
  Text,
} from "@react-three/drei";
import { Suspense } from "react";

type ProductViewer3DProps = {
  color: string;
};

function SmartWatch({ color }: ProductViewer3DProps) {
  return (
    <Float
      speed={1.8}
      rotationIntensity={0.25}
      floatIntensity={0.5}
    >
      <group>
        {/* Top Strap */}
        <RoundedBox
          args={[1.35, 2.2, 0.28]}
          radius={0.22}
          smoothness={6}
          position={[0, 1.9, 0]}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.35}
          />
        </RoundedBox>

        {/* Bottom Strap */}
        <RoundedBox
          args={[1.35, 2.2, 0.28]}
          radius={0.22}
          smoothness={6}
          position={[0, -1.9, 0]}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.35}
          />
        </RoundedBox>

        {/* Watch Body - also changes color */}
        <RoundedBox
          args={[2.8, 3.1, 0.65]}
          radius={0.5}
          smoothness={8}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.75}
            roughness={0.25}
          />
        </RoundedBox>

        {/* Screen */}
        <RoundedBox
          args={[2.35, 2.65, 0.12]}
          radius={0.38}
          smoothness={8}
          position={[0, 0, 0.38]}
        >
          <meshStandardMaterial
            color="#07070b"
            metalness={0.3}
            roughness={0.15}
          />
        </RoundedBox>

        {/* Digital Clock */}
        <Text
          position={[0, 0.3, 0.47]}
          fontSize={0.48}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          10:09
        </Text>

        <Text
          position={[0, -0.45, 0.47]}
          fontSize={0.18}
          letterSpacing={0.18}
          color="#9d8cff"
          anchorX="center"
          anchorY="middle"
        >
          NEXA
        </Text>

        {/* Side Crown */}
        <mesh position={[1.55, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.25, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function ProductViewer3D({
  color,
}: ProductViewer3DProps) {
  return (
    <div className="product-viewer-3d">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />

          <directionalLight
            position={[4, 5, 4]}
            intensity={3}
          />

          <pointLight
            position={[-4, 2, 3]}
            intensity={20}
            color="#7c5cff"
          />

          {/* key forces update when color changes */}
          <SmartWatch
            key={color}
            color={color}
          />

          <Environment preset="city" />

          <OrbitControls
            enablePan={false}
            minDistance={5}
            maxDistance={10}
            autoRotate
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}