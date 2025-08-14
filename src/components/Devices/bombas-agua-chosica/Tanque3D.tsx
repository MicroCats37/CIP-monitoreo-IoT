"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { useRef, useMemo } from "react"
import { Color, DoubleSide } from "three"
import * as THREE from 'three'
interface AguaProps {
  nivel: number
  maximo: number
}

function SuperficieAgua({ nivel, maximo }: AguaProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const porcentaje = (nivel / maximo) * 100
  const alturaAgua = -1.5 + (porcentaje / 100) * 3

  const vertexShader = `
    uniform float uTime;
    uniform float uWaveHeight;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      vUv = uv;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      float elevation = sin(modelPosition.x * 6.0 + uTime * 2.0) * 0.02;
      elevation += sin(modelPosition.z * 4.0 + uTime * 1.5) * 0.015;
      elevation += sin(modelPosition.x * 3.0 + modelPosition.z * 3.0 + uTime * 0.8) * 0.01;
      
      modelPosition.y += elevation * uWaveHeight;
      vElevation = elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorDeep;
    uniform vec3 uColorSurface;
    varying vec2 vUv;
    varying float vElevation;
    
    void main() {
      float mixStrength = (vElevation + 0.02) * 20.0;
      vec3 color = mix(uColorDeep, uColorSurface, mixStrength);
      
      float alpha = 0.9 + vElevation * 2.0;
      
      gl_FragColor = vec4(color, alpha);
    }
  `

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveHeight: { value: 1.0 },
      uColorDeep: { value: new Color("#156aba") },
      uColorSurface: { value: new Color("#40a4df") },
    }),
    [],
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uWaveHeight.value = Math.max(0.1, porcentaje * 0.01)
    }
  })

  if (porcentaje <= 0) return null

  return (
    <mesh ref={meshRef} position={[0, alturaAgua, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[1.91, 1.91, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function VolumenAgua({ nivel, maximo }: { nivel: number; maximo: number }) {
  const porcentaje = (nivel / maximo) * 100
  const alturaAgua = (porcentaje / 100) * 3

  if (porcentaje <= 0) return null

  return (
    <mesh position={[0, -1.5 + alturaAgua / 2, 0]} renderOrder={0}>
      <boxGeometry args={[1.9, alturaAgua, 1.9]} />
      <meshPhysicalMaterial
        color="#04325e"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0}
        transmission={0.6}
        thickness={0.5}
        ior={1.33}
        depthWrite={false}
      />
    </mesh>
  )
}

function Burbujas({ nivel, maximo }: { nivel: number; maximo: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const porcentaje = (nivel / maximo) * 100

  const burbujas = useMemo(() => {
    const count = Math.floor(porcentaje / 15)
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 1.4,
      z: (Math.random() - 0.5) * 1.4,
      speed: 0.3 + Math.random() * 0.4,
      size: 0.015 + Math.random() * 0.02,
      offset: Math.random() * Math.PI * 2,
    }))
  }, [Math.floor(porcentaje / 15)])

  useFrame((state) => {
    if (groupRef.current && porcentaje > 0) {
      const alturaMaxima = -1.5 + (porcentaje / 100) * 3

      groupRef.current.children.forEach((burbuja, i) => {
        const data = burbujas[i]
        if (data) {
          const ciclo = (state.clock.elapsedTime * data.speed + data.offset) % 4
          const y = -1.4 + (ciclo / 4) * (alturaMaxima + 1.4)

          if (y <= alturaMaxima) {
            burbuja.position.y = y
            burbuja.position.x = data.x + Math.sin(state.clock.elapsedTime + data.offset) * 0.05
            burbuja.visible = true
          } else {
            burbuja.visible = false
          }
        }
      })
    }
  })

  if (porcentaje < 5) return null

  return (
    <group ref={groupRef}>
      {burbujas.map((burbuja) => (
        <mesh key={burbuja.id} position={[burbuja.x, -1.5, burbuja.z]} renderOrder={2}>
          <sphereGeometry args={[burbuja.size, 8, 8]} />
          <meshPhysicalMaterial
            color="#87ceeb"
            transparent
            opacity={0.6}
            roughness={0}
            metalness={0}
            transmission={0.8}
            ior={1.33}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function ParedesTanque() {
  const materialVidrio = (
    <meshPhysicalMaterial
      color="#ffffff"
      transparent
      opacity={0.1}
      roughness={0}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0}
      transmission={0.98}
      thickness={0.05}
      ior={1.5}
      depthWrite={false}
    />
  )

  const grosorPared = 0.05
  const ancho = 2
  const alto = 3.2
  const profundidad = 2

  return (
    <group renderOrder={3}>
      {/* Pared frontal */}
      <mesh position={[0, 0, profundidad / 2]}>
        <boxGeometry args={[ancho, alto, grosorPared]} />
        {materialVidrio}
      </mesh>

      {/* Pared trasera */}
      <mesh position={[0, 0, -profundidad / 2]}>
        <boxGeometry args={[ancho, alto, grosorPared]} />
        {materialVidrio}
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-ancho / 2, 0, 0]}>
        <boxGeometry args={[grosorPared, alto, profundidad]} />
        {materialVidrio}
      </mesh>

      {/* Pared derecha */}
      <mesh position={[ancho / 2, 0, 0]}>
        <boxGeometry args={[grosorPared, alto, profundidad]} />
        {materialVidrio}
      </mesh>

      {/* Base */}
      <mesh position={[0, -alto / 2, 0]}>
        <boxGeometry args={[ancho, grosorPared, profundidad]} />
        {materialVidrio}
      </mesh>
    </group>
  )
}

function PrismaConAgua({ nivel, maximo }: { nivel: number; maximo: number }) {
  return (
    <group position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <VolumenAgua nivel={nivel} maximo={maximo} />
      <SuperficieAgua nivel={nivel} maximo={maximo} />
      <Burbujas nivel={nivel} maximo={maximo} />
      <ParedesTanque />
    </group>
  )
}

interface Prisma3DProps {
  nivel: number
  maximo: number
}

export default function Tanque3D({ nivel, maximo}: Prisma3DProps) {
  return (
    <div className="flex  aspect-square">
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }} gl={{ alpha: true, antialias: true, sortObjects: true }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 3, 0]} intensity={0.5} color="#40a4df" />
        <pointLight position={[2, 0, 2]} intensity={0.3} color="#ffffff" />

        <PrismaConAgua nivel={nivel} maximo={maximo} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={10}
        />

        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}