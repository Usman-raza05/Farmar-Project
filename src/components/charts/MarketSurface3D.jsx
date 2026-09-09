import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { MARKET_SURFACE } from '../../lib/enr'

export default function MarketSurface3D({ crop = MARKET_SURFACE.crop }) {
  const mountRef = useRef(null)
  const frameRef = useRef(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const width = mount.clientWidth || 640
    const height = mount.clientHeight || 320

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(7.2, 5.4, 7.8)
    camera.lookAt(2.2, 0.4, 2.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xdde8d8, 1.6))
    const key = new THREE.DirectionalLight(0xfff2c9, 1.4)
    key.position.set(4, 8, 2)
    scene.add(key)
    const fill = new THREE.PointLight(0x7ec8a3, 18, 20)
    fill.position.set(-2, 3, 4)
    scene.add(fill)

    const { grid, mandis, days } = MARKET_SURFACE
    const flat = grid.flat()
    const min = Math.min(...flat)
    const max = Math.max(...flat)
    const group = new THREE.Group()

    const barGeo = new THREE.BoxGeometry(0.55, 1, 0.55)

    grid.forEach((row, zi) => {
      row.forEach((price, xi) => {
        const t = (price - min) / (max - min || 1)
        const h = 0.35 + t * 2.8
        const color = new THREE.Color().setHSL(0.28 - t * 0.18, 0.55, 0.32 + t * 0.28)
        const mat = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.08,
          roughness: 0.45,
          emissive: color,
          emissiveIntensity: 0.12,
        })
        const mesh = new THREE.Mesh(barGeo, mat)
        mesh.scale.y = h
        mesh.position.set(xi * 0.85, h / 2, zi * 0.85)
        group.add(mesh)
      })
    })

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(days.length * 0.9, mandis.length * 0.9),
      new THREE.MeshStandardMaterial({ color: 0x1a3a2c, transparent: true, opacity: 0.55 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.set(((days.length - 1) * 0.85) / 2, 0, ((mandis.length - 1) * 0.85) / 2)
    group.add(floor)

    group.position.set(-1.6, -0.2, -1.4)
    scene.add(group)

    let spinning = true
    const onEnter = () => { spinning = false }
    const onLeave = () => { spinning = true }
    mount.addEventListener('pointerenter', onEnter)
    mount.addEventListener('pointerleave', onLeave)

    const onResize = () => {
      const w = mount.clientWidth || 640
      const h = mount.clientHeight || 320
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      if (spinning) group.rotation.y += 0.004
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      mount.removeEventListener('pointerenter', onEnter)
      mount.removeEventListener('pointerleave', onLeave)
      renderer.dispose()
      barGeo.dispose()
      group.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose?.()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="market-3d">
      <div className="market-3d-head">
        <div>
          <p className="eyebrow">3D market surface</p>
          <h2>{crop} · Maharashtra mandis</h2>
          <p className="enr-sub">Height = modal price over the last 7 days. Hover to pause rotation.</p>
        </div>
        <ul className="market-3d-legend">
          {MARKET_SURFACE.mandis.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="market-3d-canvas" ref={mountRef} aria-label={`${crop} 3D price surface chart`} />
      <div className="market-3d-axis">
        {MARKET_SURFACE.days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}
