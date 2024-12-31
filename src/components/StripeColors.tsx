const StripeColors = (
  color1: any,
  color2: any,
  colorWidth: any,
  width: any = '28px',
  border: Boolean = false,
  borderRight: Boolean = false
) => {
  const lineGradient = {
    width: width,
    height: '10px',
    borderTopLeftRadius: border ? '20px' : '0px',
    borderBottomLeftRadius: border ? '20px' : '0px',
    borderTopRightRadius: borderRight ? '20px' : '0px', 
    borderBottomRightRadius: borderRight ? '20px' : '0px', 
    transform: 'skewX(-10deg)',
    transformOrigin: 'right', 
    background: `repeating-linear-gradient(
      120deg, 
      ${color1}, 
      ${color1} ${colorWidth}, 
      ${color2} 2px, 
      ${color2} 9px`,
  }
  return lineGradient
}

export default StripeColors
