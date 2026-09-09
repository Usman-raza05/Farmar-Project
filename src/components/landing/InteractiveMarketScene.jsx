import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/** Original Farmly 3D market network (pre-farmer scene) */
export default function InteractiveMarketScene() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 1.6, 7)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth || 420, canvas.clientHeight || 280, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    scene.add(new THREE.AmbientLight(0xcfe8c4, 2.2))
    const keyLight = new THREE.PointLight(0xe8b84b, 12, 12)
    keyLight.position.set(2, 4, 4)
    scene.add(keyLight)

    const field = new THREE.Group()
    const grid = new THREE.GridHelper(6, 18, 0x5d9775, 0x2a654d)
    grid.rotation.x = 0.18
    field.add(grid)

    const nodeGeometry = new THREE.SphereGeometry(0.12, 16, 16)
    const nodeMaterials = [0xe8b84b, 0x8fd69c, 0xf7f3e9].map((color) =>
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.25 }),
    )
    const nodePositions = [[-2, 0.25, 0.4], [-0.7, 0.5, -0.6], [0.8, 0.32, 0.4], [1.9, 0.65, -0.4], [0, 0.95, 0]]
    nodePositions.forEach(([x, y, z], index) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterials[index % nodeMaterials.length])
      node.position.set(x, y, z)
      node.userData.baseY = y
      field.add(node)
    })

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xe8b84b, transparent: true, opacity: 0.5 })
    ;[[0, 1], [1, 2], [2, 3], [1, 4], [4, 2]].forEach(([from, to]) => {
      const points = [new THREE.Vector3(...nodePositions[from]), new THREE.Vector3(...nodePositions[to])]
      field.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial))
    })
    scene.add(field)

    const pointer = { x: 0, y: 0 }
    const drag = { active: false, x: 0, y: 0, rotationX: 0, rotationY: 0 }
    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1
      pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
      if (drag.active) {
        drag.rotationY += (event.clientX - drag.x) * 0.012
        drag.rotationX += (event.clientY - drag.y) * 0.008
        drag.x = event.clientX
        drag.y = event.clientY
      }
    }
    const handlePointerDown = (event) => {
      drag.active = true
      drag.x = event.clientX
      drag.y = event.clientY
      canvas.setPointerCapture(event.pointerId)
    }
    const handlePointerUp = (event) => {
      drag.active = false
      canvas.releasePointerCapture(event.pointerId)
    }
    const handleWheel = (event) => {
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.004, 4.8, 9)
    }
    const onResize = () => {
      const w = canvas.clientWidth || 420
      const h = canvas.clientHeight || 280
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    canvas.addEventListener('pointermove', handlePointer)
    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerUp)
    canvas.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('resize', onResize)
    onResize()

    let frameId
    const startedAt = performance.now()
    const animate = (now) => {
      const elapsed = (now - startedAt) * 0.001
      field.rotation.y = drag.rotationY + Math.sin(elapsed * 0.25) * 0.04 + pointer.x * 0.02
      field.rotation.x = drag.rotationX * 0.5 + pointer.y * 0.06
      field.children.forEach((child, index) => {
        if (child.isMesh && child.userData.baseY) {
          child.position.y = child.userData.baseY + Math.sin(elapsed * 1.8 + index) * 0.05
        }
      })
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameId)
      canvas.removeEventListener('pointermove', handlePointer)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      canvas.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      nodeGeometry.dispose()
      nodeMaterials.forEach((material) => material.dispose())
      lineMaterial.dispose()
    }
  }, [])

  return (
    <div className="three-market-card overflow-hidden rounded-2xl border border-[#1f4d3a]/25 bg-[#123628] shadow-[0_18px_40px_rgba(18,53,40,0.2)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div>
          <span className="text-sm font-semibold text-[#f7f3e9]">3D market pulse</span>
          <small className="mt-0.5 block text-[0.65rem] text-white/45">Drag to explore · scroll to zoom</small>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[0.65rem] font-semibold text-emerald-300">Live</span>
      </div>
      <canvas ref={canvasRef} className="block h-[240px] w-full" aria-label="Interactive 3D market network" />
    </div>
  )
}
