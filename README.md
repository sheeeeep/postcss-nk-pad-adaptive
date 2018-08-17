# postcss-nk12-pad-adaptive

![](https://travis-ci.org/sheeeeep/postcss-nk-pad-adaptive.svg?branch=master)

1. example
```css
//input
.selector {
    padding: 100px;
    width: 100%;  /*nka-no*/
    border-radius: 50px; /*nka-yes*/
}

// output
@media screen and (min-width: 768px) {
    .selector {
        padding: 50px;
        width: 100%;
        border-radius: 25px;
    }
}
```

2. options
``` javascript
const defaultOpt = {
    global: false, // 全局开关，关闭时，只处理含有注释/*pad-adaptive*/的文件
    includeDecls: [ // 将会处理的css规则列表。列表中规则，跟随注释/*nka-no*/时，忽略。不在列表中的规则，跟随注释/*nka-yes*/时，处理
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
    breakRules: [{ // 媒体查询规则列表
        bound: 768, // 媒体查询对应的最小屏幕宽度
        multiple: 2 // 计算倍数
    }]
};
```