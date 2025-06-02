const base32 = '0123456789bcdefghjkmnpqrstuvwxyz'
const ghsToBinary = (ghs: string) => ghs.split('').map(char => base32.indexOf(char).toString(2).padStart(5, '0')).join('') //For some reason I like to use arrow syntax with oneliners, don't know why

export function interleave(a: string, b: string): string {
  let joinedString = "";
  let aCounter = 1;
  let bCounter = 1;
  for (let i = 0; i <= a.length + b.length; i++) {
    if (i % 2 == 0) {
      joinedString += b[b.length - bCounter] ?? ""
      bCounter++
    } else {
      joinedString += a[a.length - aCounter] ?? ""
      aCounter++;
    }
  }
  return joinedString.split('').reverse().join('')
}

export function encode([lon, lat]: number[], precision: number): string {
  if (precision > 11) {
    precision = 11
  }
  const latitudeLength = Math.floor(2.5 * precision)
  const longitudeLength = Math.ceil(2.5 * precision)
  const latitudeQStep = 180 / Math.pow(2, latitudeLength)
  const longitudeQStep = 360 / Math.pow(2, longitudeLength)
  const latitudeCode = Math.floor((lat + 90) / latitudeQStep)
  const longitudeCode = Math.floor((lon + 180) / longitudeQStep)
  const latitudeBinary = latitudeCode.toString(2).padStart(latitudeLength, "0");
  const longitudeBinary = longitudeCode.toString(2).padStart(longitudeLength, "0");
  const binaryGeoHash = latitudeLength == longitudeLength ? interleave(longitudeBinary, latitudeBinary) : interleave(latitudeBinary, longitudeBinary)
  let geohash = "";
  for (let i = precision - 1; i >= 0; i--) {
    geohash += base32[Number(BigInt(parseInt(binaryGeoHash, 2)) >> BigInt(5 * i) & 31n)]
  }
  return geohash
}
export function decode(hash: string) {
  const binaryRep = ghsToBinary(hash)
  const ranges = {
    "lat": [-90, 90],
    "lon": [-180, 180]
  }
  for (let i = 0; i < binaryRep.length; i++) {
    const coordType = i % 2 == 1 ? "lat" : "lon"
    const changeIndex = binaryRep[i] == "0" ? 1 : 0
    ranges[coordType][changeIndex] = (ranges[coordType][0] + ranges[coordType][1]) / 2
  }
  return [(ranges["lon"][0] + ranges["lon"][1]) / 2, (ranges["lat"][0] + ranges["lat"][1]) / 2]
}
