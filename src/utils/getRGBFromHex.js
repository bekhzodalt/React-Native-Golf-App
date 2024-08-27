export function getRGBfromHex(hex){
    hex = '0x' + hex
    let r = hex >> 16 & 0xFF
    let g = hex >> 8 & 0xFF
    let b = hex & 0xFF
    return {r, g, b}
}