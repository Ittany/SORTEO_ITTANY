/* Paleta de pelotas — cada par [c1, c2] forma el degradado */
export const BALL_COLORS = [
  ['#D946EF', '#8B1FBF'],  // fucsia
  ['#A855F7', '#6D28D9'],  // violeta
  ['#22D3EE', '#0891B2'],  // cian
  ['#34D399', '#059669'],  // verde
  ['#FBBF24', '#D97706'],  // dorado
  ['#F472B6', '#BE185D'],  // rosa
  ['#60A5FA', '#2563EB'],  // azul
  ['#FB7185', '#BE123C'],  // rojo
  ['#A78BFA', '#7C3AED'],  // lavanda
  ['#F97316', '#C2410C'],  // naranja
]

export function colorForNumber(number) {
  const idx = Math.abs(Number(number) || 0) % BALL_COLORS.length
  return BALL_COLORS[idx]
}