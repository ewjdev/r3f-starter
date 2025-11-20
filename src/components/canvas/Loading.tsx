'use client'

import { Text, Container, Fullscreen } from '@react-three/uikit'
import { PerspectiveCamera, useProgress } from '@react-three/drei'
import { memo, useEffect, useState } from 'react'
import { Ui } from '@/helpers/components/Ui'
import { useSpring, animated } from '@react-spring/three'

const AnimatedContainer = animated(Container)

const MAX_WIDTH = 300
const MIN_WIDTH = 50

const Loading = memo((props) => {
  const { progress } = useProgress()

  const w = Math.max(Math.round((progress / 100) * MAX_WIDTH), MIN_WIDTH)
  0
  const [show, setShow] = useState(progress < 100)
  useEffect(() => {
    if (progress >= 100 && show) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          setShow(false)
        })
      }, 1000)
    }
  }, [progress, show])

  const { width } = useSpring({
    width: w,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  })
  const { opacity } = useSpring({
    opacity: !show ? 0 : 1,
    config: { mass: 1, tension: 170, friction: 26, precision: 0.0001 },
  })

  console.log({ show, width: width.get(), progress, w, opacity: opacity.get() })

  return (
    <Ui>
      <PerspectiveCamera position={[-20, 40, 30]} fov={45} near={1} far={300} />
      <Fullscreen flexDirection='row' justifyContent='center' alignItems='center' padding={10} gap={10}>
        <AnimatedContainer
          flexDirection='row'
          justifyContent='center'
          alignItems='center'
          width={width}
          backgroundColor='black'
          borderRadius={10}
          padding={10}
          opacity={opacity}
        >
          <Text fontSize={20} color='white'>
            {Math.round(progress)}%
          </Text>
        </AnimatedContainer>
      </Fullscreen>
    </Ui>
  )
})

export default Loading
