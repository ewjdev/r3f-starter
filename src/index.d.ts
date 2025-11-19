declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      // You can also define specific props for ambientLight here if needed,
      // but ThreeElements usually covers the common R3F components.
      // ambientLight: SomeAmbientLightProps;
    }
  }
}
