const postcss = require('postcss');
const nk12PadAdaptive = require('./dist/index.js').default();

const result = postcss.parse(`
/* pad-adaptive */
.a { width: 64px; height: 64px;}
@media screen and (min-width: 250px){
    .b { width: 64px; height: 64px;}
}
`);

nk12PadAdaptive(result);

console.log(result.toString())