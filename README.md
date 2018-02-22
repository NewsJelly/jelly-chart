Jelly-Chart
===

Jelly-Chart is a chart library based on D3v4 and SVG.

![chart-types](https://user-images.githubusercontent.com/253408/36471496-f56f6ed6-1731-11e8-8eaf-e9446b32b3cd.png)

Chart Types
---
- Bar ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/Bar.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/grouped-bar))
- Line ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/Line.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/multi-line))
- Pie ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/Pie.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/donut-pie))
- Scatter ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/Scatter.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/color-scatter))
- Parallel Coordinates ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/ParCoords.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/color-par-coords))
- Treemap ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/Treemap.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/treemap))
- XY Heatmap ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/XYHeatmap.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/xy-heatmap))
- Marker Map ([API](https://newsjelly.github.io/jelly-chart/release/latest/doc/MarkerMap.html) | [Demo](https://newsjelly.github.io/jelly-chart/demo/address-marker-map))

Documents
---
- [API Documents](https://newsjelly.github.io/jelly-chart/release/latest/doc)
- [Demo](https://newsjelly.github.io/jelly-chart/demo)


Download && Installation
---

### Download

#### Use CDN

```html
<!-- jsDelivr -->
<script src="//cdn.jsdelivr.net/npm/jelly-chart/dist/jelly.min.js"></script> 
<!-- unpkg -->
<script src="//unpkg.com/jelly-chart/dist/jelly.min.js"></script> 

```

#### Install from NPM
```
$ npm install --save jelly-chart
```

### Dependency
|[D3](https://d3js.org/) (required)|
| --- |
| 4+ |

#### HTML

```html
<!-- Load D3 and jelly-chart separately -->
<!-- Load D3 first-->
<script src="//d3js.org/d3.v4.min.js"></script>    
<!-- Load jelly-chart after D3 -->
<script src="$PATH/jelly.min.js"></script>
```

#### ES6 Module
Jelly-Chart is written using [ECMAScript 6 modules](http://2ality.com/2014/09/es6-modules-final.html). After importing it, you can create a custom bundle using your preferred bundler.

```js
import jelly from "jelly-chart";
```

Basic Usage
---
### 1) Insert a chart holder element

```html
<div id="chart"></div>
```

### 2) Call a chart generator

```javascript
var bar = jelly.bar();
//or
var bar = jelly.type('bar');
```

### 3) set a container, data and options, then render

```javascript
bar.container('#chart')
  .data([
    {x: 'A', y: 10},
    {x: 'A', y: 20},
    {x: 'B', y: 15},
    {x: 'B', y: 10}
  ])
  .dimensions(['x'])
  .measures(['y'])

bar.render();
```

To find more detailed usages, check [Demo](https://newsjelly.github.io/jelly-chart/release/latest/doc/Bar.html) and [API Docs](https://newsjelly.github.io/jelly-chart/release/latest/doc/).



Development
---
Use NPM Script to build Jelly-chart

```
# Install dependencies
$ npm install

# Run dev-server for development
$ npm start

# Test
$ npm test

# Build
$ npm run build
```

LICENSE
---
GPL-3.0+