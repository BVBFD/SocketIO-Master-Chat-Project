import { CSSProp, css } from 'styled-components';

export const mobile = (props: CSSProp) => {
  return css`
    @media screen and (max-width: 1000px) {
      ${props}
    }
  `;
};
