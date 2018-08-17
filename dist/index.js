'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOpt = {
    global: false,
    includeDecls: ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'top', 'right', 'bottom', 'left', 'width', 'height', 'line-height'],
    breakRules: [{
        bound: 768,
        multiple: 2
    }]
};

var isNeedAdaptive = function isNeedAdaptive(css) {
    var ret = false;
    css.walkComments(function (comment) {
        if (comment.text === 'pad-adaptive') {
            ret = true;
        }
    });
    return ret;
};

exports.default = _postcss2.default.plugin('nk-pad-adaptive', function (opts) {
    opts = Object.assign({}, defaultOpt, opts);

    return function (css) {
        if (!opts.global && !isNeedAdaptive(css)) {
            return;
        }

        var filterCSS = css.clone();

        filterCSS.walkAtRules(function (atRule) {
            atRule.remove();
        });

        filterCSS.walkRules(function (rule) {
            rule.nodes.forEach(function (node, index) {
                // remove the decl with comment is /*nka-no*/
                if (node.type === 'comment' && node.text === 'nka-no') {
                    var removeNode = rule.nodes[index - 1];
                    if (removeNode && removeNode.type === 'decl') {
                        removeNode.remove();
                    }
                }
                // remain the decl with comment is /*nka-yes*/
                if (node.type === 'comment' && node.text === 'nka-yes') {
                    var _removeNode = rule.nodes[index - 1];
                    if (_removeNode && _removeNode.type === 'decl') {
                        _removeNode.nkYes = true;
                    }
                }
            });
        });

        filterCSS.walkDecls(function (decl) {
            if (!opts.includeDecls.includes(decl.prop) && !decl.nkYes) {
                decl.remove();
                return;
            }
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