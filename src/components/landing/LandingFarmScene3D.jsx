import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function makeFarmer(colors) {
  const group = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.22, 0.55, 6, 10),
    new THREE.MeshStandardMaterial({ color: colors.shirt, roughness: 0.55 }),
  )
  body.position.y = 0.85
  group.add(body)

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshStandardMaterial({ color: colors.skin, roughness: 0.7 }),
  )
  head.position.y = 1.45
  group.add(head)

  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.28, 0.22, 10),
    new THREE.MeshStandardMaterial({ color: colors.hat, roughness: 0.65 }),
  )
  hat.position.y = 1.62
  group.add(hat)

  const brim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: colors.hat, roughness: 0.65 }),
  )
  brim.position.y = 1.52
  group.add(brim)

  ;[-1, 1].forEach((side) => {
    const arm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.06, 0.35, 4, 8),
      new THREE.MeshStandardMaterial({ color: colors.shirt, roughness: 0.55 }),
    )
    arm.position.set(side * 0.32, 0.95, 0)
    arm.rotation.z = side * 0.35
    group.add(arm)

    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.07, 0.4, 4, 8),
      new THREE.MeshStandardMaterial({ color: colors.pants, roughness: 0.6 }),
    )
    leg.position.set(side * 0.12, 0.35, 0)
    group.add(leg)
  })

  const sack = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.8 }),
  )
  sack.scale.set(1, 1.2, 0.9)
  sack.position.set(0.42, 0.7, 0.05)
  group.add(sack)

  group.userData.bob = Math.random() * Math.PI * 2
  return group
}

function makeCropRow(z, tint) {
  const row = new THREE.Group()
  for (let i = -4; i <= 4; i += 1) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.03, 0.45, 6),
      new THREE.MeshStandardMaterial({ color: 0x2f6b4f }),
    )
    stem.position.set(i * 0.55 + (z % 2) * 0.2, 0.22, z)
    row.add(stem)

    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      new THREE.MeshStandardMaterial({ color: tint, roughness: 0.7 }),
    )
    leaf.scale.set(1.4, 0.7, 1)
    leaf.position.set(stem.position.x, 0.48, z)
    row.add(leaf)
  }
  return row
}

/** Stylized 3D farmers in a Maharashtra field — no external model files */
export default function LandingFarmScene3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const width = mount.clientWidth || 520
    const height = mount.clientHeight || 420

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    camera.position.set(0.2, 2.4, 6.2)
    camera.lookAt(0, 0.9, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xd8ecd8, 1.5))
    const sun = new THREE.DirectionalLight(0xffe6a8, 1.6)
    sun.position.set(3, 6, 2)
    scene.add(sun)
    const rim = new THREE.PointLight(0xe6b84a, 10, 14)
    rim.position.set(-2, 2.5, 3)
    scene.add(rim)

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(5.5, 48),
      new THREE.MeshStandardMaterial({ color: 0x1f4d3a, roughness: 0.95 }),
    )
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(3.2, 3.35, 48),
      new THREE.MeshBasicMaterial({ color: 0xe6b84a, transparent: true, opacity: 0.35, side: THREE.DoubleSide }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.02
    scene.add(ring)

    ;[-1.6, -0.5, 0.6, 1.7].forEach((z, i) => {
      scene.add(makeCropRow(z, i % 2 === 0 ? 0x5fae78 : 0x8fd69c))
    })

    const farmers = [
      makeFarmer({ shirt: 0xe8b84b, pants: 0x2a3d32, hat: 0xc48a2a, skin: 0xc68642 }),
      makeFarmer({ shirt: 0xf0f4ec, pants: 0x1f4d3a, hat: 0x8b5a2b, skin: 0xd4a574 }),
      makeFarmer({ shirt: 0x3d7a5a, pants: 0x24352c, hat: 0xd4a017, skin: 0xb56b3c }),
    ]
    farmers[0].position.set(-1.35, 0, 0.9)
    farmers[1].position.set(0.15, 0, 1.35)
    farmers[2].position.set(1.4, 0, 0.75)
    farmers[0].rotation.y = 0.35
    farmers[1].rotation.y = -0.15
    farmers[2].rotation.y = -0.45
    farmers.forEach((f) => scene.add(f))

    const priceOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xe6b84a, emissive: 0xe6b84a, emissiveIntensity: 0.45 }),
    )
    priceOrb.position.set(0.2, 2.35, 0.4)
    scene.add(priceOrb)

    let frameId = 0
    const started = performance.now()
    const pointer = { x: 0, y: 0 }
    const onMove = (event) => {
      const b = mount.getBoundingClientRect()
      pointer.x = ((event.clientX - b.left) / b.width) * 2 - 1
      pointer.y = -(((event.clientY - b.top) / b.height) * 2 - 1)
    }
    mount.addEventListener('pointermove', onMove)

    const onResize = () => {
      const w = mount.clientWidth || 520
      const h = mount.clientHeight || 420
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const animate = (now) => {
      const t = (now - started) * 0.001
      farmers.forEach((farmer, i) => {
        farmer.position.y = Math.sin(t * 1.6 + farmer.userData.bob) * 0.04
        farmer.rotation.y += Math.sin(t * 0.5 + i) * 0.0008
      })
      priceOrb.position.y = 2.35 + Math.sin(t * 2) * 0.12
      priceOrb.rotation.y += 0.02
      ring.rotation.z = t * 0.15
      camera.position.x = 0.2 + pointer.x * 0.35
      camera.position.y = 2.4 + pointer.y * 0.15
      camera.lookAt(0, 0.9, 0)
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
    }
  }, [])

  return (
    <div className="landing-farm-scene">
      <div className="landing-farm-canvas" ref={mountRef} aria-label="3D farmers in a digital field" />
      <div className="landing-farm-caption">
        <span className="pulse-dot" />
        <div>
          <strong>Farmers → better buyers</strong>
          <small>Live 3D field · Maharashtra network</small>
        </div>
      </div>
    </div>
  )
}
