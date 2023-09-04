import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html, body {
        margin: 0;
        font-family: 'Coco Gothic Regular';
        src: local('Coco Gothic Regular'), url('Coco-Gothic-Regular-trial.woff') format('woff');
    }
`;
