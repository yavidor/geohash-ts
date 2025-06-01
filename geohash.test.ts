import { decode } from "./geohash";
test('9vc0de0nx', () => {
  expect(decode('9vc0de0nx')).toBeDefined()
})
