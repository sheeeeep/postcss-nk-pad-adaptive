'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOpt = {
    global: false,
    includeDecls: ['margin', 'padding', 'top', 'right', 'bottom', 'left', 'width', 'height', 'line-height'],
    breakRules: [{
        bound: 750,
        multiple: 2
    }]
};

var AdaptiveFlagIndex = 0;

var isNeedAdaptive = function isNeedAdaptive(firstNode) {
    return firstNode.type === 'comment' && firstNode.text === 'pad-adaptive';
};

exports.default = _postcss2.default.plugin('nk-pad-adaptive', function (opts) {
    opts = Object.assign({}, defaultOpt, opts);

    return function (css) {
        if (!opts.global && !isNeedAdaptive(css.nodes[AdaptiveFlagIndex])) {
            return;
        }

        var filterCSS = css.clone();

        filterCSS.walkAtRules(function (atRule) {
            if (atRule.name === 'media') {
                atRule.remove();
            }
        });

        filterCSS.walkDecls(function (decl) {
            if (!opts.includeDecls.includes(decl.prop)) {
                decl.remove();
                return;
            }
            //TODO: remove the decl with comment is /*no*/
        });

        filterCSS.walkComments(function (comment) {
            comment.remove();
        });

        // create media query
        opts.breakRules.forEach(function (breakRule) {
            var mediaQuery = _postcss2.default.atRule({
                name: 'media',
                params: `screen and (min-width: ${breakRule.bound}px)`
            });

            var finalCSS = filterCSS.clone();

            finalCSS.walkDecls(function (decl) {
                decl.value = decl.value.replace(/(\d+)/g, function (match) {
                    return Number(match) / breakRule.multiple;
                });
            });

            mediaQuery.append(finalCSS.nodes);
            css.append(mediaQuery);
        });
    };
});