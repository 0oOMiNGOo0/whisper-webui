import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
@tailwind base;
@tailwind components;
@tailwind utilities;

    html, body {
        margin: 0;
        font-family: 'Pretendard';
    }
`;
