'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars, Trail } from '@react-three/drei'
import * as THREE from 'three'

function FloatingIcosahedron({ position, scale, color, speed = 1 }: {
  position: [number, number, number]
  scale: number
  color: string
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.5
      meshRef.current.rotation.y += 0.005 * speed
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2 * speed) * 0.3
    }
  })

  return (
    <Float speed={2 * speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          distort={0.2}
          speed={3}
        />
      </mesh>
    </Float>
  )
}

function FloatingTorus({ position, scale, color, speed = 1 }: {
  position: [number, number, number]
  scale: number
  color: string
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.008 * speed
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 * speed) * 0.4
    }
  })

  return (
    <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <MeshWobbleMaterial
          color={color}
          transparent
          opacity={0.12}
          wireframe
          factor={0.3}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

function FloatingOctahedron({ position, scale, color, speed = 1 }: {
  position: [number, number, number]
  scale: number
  color: string
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.25 * speed) * 0.6
      meshRef.current.rotation.z += 0.007 * speed
    }
  })

  return (
    <Float speed={1.8 * speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.1}
          wireframe
          distort={0.15}
          speed={2.5}
        />
      </mesh>
    </Float>
  )
}

function GlowingSphere({ position, scale, color }: {
  position: [number, number, number]
  scale: number
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 1.5) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.06}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#a855f7" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#06b6d4" />

      <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={1} />

      <FloatingIcosahedron position={[-4, 2, -3]} scale={1.5} color="#a855f7" speed={0.8} />
      <FloatingIcosahedron position={[5, -1, -5]} scale={1} color="#06b6d4" speed={1.2} />
      <FloatingIcosahedron position={[-2, -3, -2]} scale={0.6} color="#c084fc" speed={1.5} />

      <FloatingTorus position={[3, 3, -4]} scale={1.2} color="#06b6d4" speed={0.6} />
      <FloatingTorus position={[-5, -2, -6]} scale={0.8} color="#a855f7" speed={1} />

      <FloatingOctahedron position={[4, -3, -3]} scale={0.9} color="#8b5cf6" speed={0.9} />
      <FloatingOctahedron position={[-3, 4, -5]} scale={0.7} color="#22d3ee" speed={1.3} />

      <GlowingSphere position={[0, 0, -8]} scale={3} color="#a855f7" />
      <GlowingSphere position={[6, 2, -10]} scale={2} color="#06b6d4" />
      <GlowingSphere position={[-5, -3, -9]} scale={1.5} color="#8b5cf6" />

      <ParticleField />
    </>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}