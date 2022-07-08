---
title: Zoom and Pan
---

Two-dimensional graphs within the graph viewport are meant to feel familar to anyone who has used a map app. The graph can be zoomed and panned, both in touch- and mouse- driven environments. 

For mouse-driven environments, panning is achieved by clicking within the viewport and dragging; to zoom, use a mouse wheel.

For touch-driven environments, panning is done by single-tap-dragging; zooming can be achieved by two-tap pinching.

GraphCa will attempt to update the grid to show an appropriate number of lines for the current scale the viewport is zoomed to. The default scale results in each line representing 1-unit. Zooming in can result in seeing each line represent 0.1-unit, while zooming out can result in each line representing 10-units. 

Currently, there are no effectively imposed limits on zooming in or out, but the app can get buggy as it approaches either massive or tiny scales.

Movement of the viewport will result in the grid being relabeled with new line number markers. Under the default viewport, these are bound to the axes. However, should an axis be panned or zoomed out of the viewport, line labels will dock to the edge of the viewport closest to the unseen axis.

Panning and zooming will cause graph plots to recalculate for the new viewport boundaries. This can cause the system to become laggy on less capable hardware. As an alternative, consider clearing the current set of plots, repositioning the viewport where you are interested in looking at a plot, and then plotting the expression.
