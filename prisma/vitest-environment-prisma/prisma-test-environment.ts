import { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('executou')

    return {
      teardown() {},
    }
  },
  // optional - only if you support "experimental-vm" pool
}
