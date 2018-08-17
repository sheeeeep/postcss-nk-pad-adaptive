const postcss = require('postcss');
const nk12PadAdaptive = require('./dist/index.js').default();

const result = postcss.parse(`
/*pad-adaptive*/
@import 'bourbon/bourbon';
@import 'helper/helper';
@import "base/var";

.project-info-card {
    width: 330px; /*nka-no*/
    height: 330px; /*nka-no*/

    background-color: #fff;
    text-align: center;

    border-radius: 32px; /*nka-yes*/
    box-shadow: 0px 3px 10px 0px rgb(208, 211, 230); /*nka-yes*/
}
`);

nk12PadAdaptive(result);

console.log(result.toString())