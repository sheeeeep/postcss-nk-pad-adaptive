import postcss from 'postcss';

const defaultOpt = {
    global: false,
    includeDecls: [
        'margin',
        'padding',
        'top',
        'right',
        'bottom',
        'left',
        'width',
        'height',
        'line-height'
    ],
    breakRules: [{
        bound: 750,
        multiple: 2
    }]
};

const AdaptiveFlagIndex = 0;

const isNeedAdaptive = function isNeedAdaptive(firstNode) {
    return firstNode.type === 'comment' && firstNode.text === 'pad-adaptive';
}

export default postcss.plugin('nk-pad-adaptive', (opts) => {
	opts = Object.assign({}, defaultOpt, opts);

	return css => {
        if(!opts.global && !isNeedAdaptive(css.nodes[AdaptiveFlagIndex])) {
            return;
        }

        const filterCSS = css.clone();

        filterCSS.walkAtRules( atRule => {
            if(atRule.name === 'media') {
                atRule.remove()
            }
        });

        filterCSS.walkDecls( decl => {
            if(!opts.includeDecls.includes(decl.prop)) {
                decl.remove();
                return;
            }
            //TODO: remove the decl with comment is /*no*/
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
