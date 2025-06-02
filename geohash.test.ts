import { decode, encode } from "./geohash";
test('9vc0de0nx', () => {
  expect(decode('9vc0de0nx')).toEqual([-99.73356485366821, 32.449257373809814])
  expect(encode([-99.73356485366821, 32.449257373809814], 9)).toEqual('9vc0de0nx')
})
