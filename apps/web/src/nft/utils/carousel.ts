export const calculateCardIndex = (x: number, l: number) => {
  return (x < 0 ? x + l : x) % l
}

