---
title: Creating a Graph
---

GraphCa currently supports generating two-dimensional graphs: essentially, for functions of a single variable. These are plotted in the graph viewport, located in the upper left corner in desktop and landscape environments, or at the top of the screen in mobile and portrait environments. The graph viewport shows a grid; every fifth line at the current level of scale will be labeled with its value to help contextualize plots. Refer to [zoom and pan](/graphca/graphing/movement) for moving around the graph viewport.

Each generated response in the terminal [REPL](/graphca/terminal/repl) will contain a button to plot a graph of that response. This button contains an icon resembling an eye.

For purely numeric results, the generated plot will be a horizontal line at the `y`-coordinate associated with the value. 

For responses which contain unbound variables, graphing is more involved behind the scenes, but from a user experience perspective, activating the graph button will cause the associated expression to be plotted. GraphCa will determine the boundaries of the current graph viewport (that is, the maximum value to the left and right of the shown grid) and divide that domain up into a series of segments. The exact number of segments generated increases with the scale the graph is presented, so be cautious when zooming out. The expression is invoked repeatedly with the start point of each segment to find the y-value. Line segments are then used to approximate the resulting curve between contiguous points in the domain.

For sufficiently large numbers of segments, this generates results that appear curved.

Multiple simultaneous plots are possible: each REPL response can be added to the graph viewport, and will be processed in turn. Note, this can become laggy for large numbers of plotted expressions.
