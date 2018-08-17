import postcss from 'postcss';

const defaultOpt = {
    global: false,
    includeDecls: [
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'top',
        'right',
        'bottom',
        'left',
        'width',
        'height',
        'line-height'
    ],
    breakRules: [{
        bound: 768,
        multiple: 2
    }]
};

const isNeedAdaptive = function isNeedAdaptive(css) {
    let ret = false;
    css.walkComments(comment => {
        if(comment.text === 'pad-adaptive') {
            ret = true;
        }
    })
    return ret;
}

export default postcss.plugin('nk-pad-adaptive', (opts) => {
	opts = Object.assign({}, defaultOpt, opts);

	return css => {
        if(!opts.global && !isNeedAdaptive(css)) {
            return;
        }

        const filterCSS = css.clone();

        filterCSS.walkAtRules( atRule => {
            atRule.remove()
        });

        filterCSS.walkRules( rule => {
            rule.nodes.forEach( (node, index) => {
                // remove the decl with comment is /*nka-no*/
                if(node.type === 'comment' && node.text ==='nka-no') {
                    const removeNode = rule.nodes[index-1];
                    if(removeNode && removeNode.type === 'decl'){
                        removeNode.remove();
                    }
                }
                // remain the decl with comment is /*nka-yes*/
                if(node.type === 'comment' && node.text ==='nka-yes') {
                    const removeNode = rule.nodes[index-1];
                    if(removeNode && removeNode.type === 'decl'){
                        removeNode.nkYes = true;
                    }
                }
            });
        })

        filterCSS.walkDecls( decl => {
            if(!opts.includeDecls.includes(decl.prop) && !decl.nkYes) {
                decl.remove();
                return;
            }
        });

        filterCSS.walkComments( comment => {
            comment.remove();
        })

        // create media query
        opts.breakRules.forEach( breakRule => {
            const mediaQuery = postcss.atRule({
                name: 'media',
                params: `screen and (min-width: ${breakRule.bound}px)`
            });

            const finalCSS = filterCSS.clone();

            finalCSS.walkDecls( decl => {
                decl.value = decl.value.replace(/(\d+)/g, match => {
                    return Number(match)/breakRule.multiple;
                })
            });

            mediaQuery.append(finalCSS.nodes);
            css.append(mediaQuery)
        });
	};
});
