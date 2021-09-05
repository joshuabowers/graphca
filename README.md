# GraphCa
A graphing calculator with analytical prowess

## About
GraphCa is a web app which allows users to input mathematical formula, analytically solve them, and graph the results.

## UX
1. Calculator keypad, featuring a standard graphing calculator layout: 10-key, common mathematical functions, scientific buttons, calculus functions, etc.
2. Graphs: an MDI which shows different graphs in a set of tabs. Might be interesting to pair with a multi-pane design to be able to compare two graphs. Note: a graph should support the plotting of multiple functions, and should be labelled accordingly.
3. Terminal: an MDI which shows interactive consoles for inputting formulae and receiving resultant output. E.g., would take an equation like: `1+1` and return `2`. Results would be interactive: clicking would bring up a menu for graphing. Note that the results might not be strictly numeric: part of GraphCa's functionality is analyzing formulae for simplification. Should have an editable area for directly inputting formulae.
4. MDI tabs should have editable names. E.g., while the tab is active, hovering over the tab would present buttons to edit or remove the tab.

## Keypad
A selection of buttons which update the input of the currently active Terminal. These would dispatch redux actions, whose sole functionality would be to update Terminal state. 

## Terminal
Should allow for exporting the output, or optionally printing the output.

## Graphs
Each graph would incorporate a set of user-modifiable boundaries to render it's equations within. Note that a given topological boundary might not result in a value being graphed, as an equation might not have output within the specified range. Graphing would only be available for 2 and 3 dimensional equations: for graphing more complex formulae, variables would need to be bound to restrict the equation to 2 or 3 space. (E.g., `bind(result, a: 5, b: 2)`). Graphs to be rendered via three.js? (See, e.g. Three.js/CatmullromCurve3 for a 3d point-to-point spline.)

## Formulae Analysis
A formulae input into a Terminal will be retained in plaintext, though might be built piecemeal via the keypad. An input formula---signified by clicking the "=" keypad button or by hitting "return"\"enter" within the Terminal---will be fed into a mathematical analysis interpreter. Ideally, this latter system would---itself---be a separate library included as a module for the application, and thus developed in tandem. The purpose of this library is to take a string, tokenize it, convert it to a syntax tree, analyze the structure of said tree, and run a series of optimization phases to the tree to reduce it to a simplified format. For example, given the string `x*x + x*x - dx(x**2)`, the result should be along the lines of `2*x**2 - 2*x`. Herein, we see one of the features of GraphCa and its support library: the interpretation and analysis of equations expressing calculus functions.

### Library Structure

#### Visitors
Visitors would be responsible for traversing an Equation tree, most likely by an in-order traversal.
1. TraverseVisitor: a generic in-order traversal, which expects an Equation and an Observer. At each node within the tree, Observer is yielded the value of that node if not null.

  *NOTE:* This might actually need to be a post-order traversal, so that operational/functional nodes can receive values from their children, then bubble them up. Or would that be a separate visitor entirely?

2. RestructureVisitor: for transforming structures like `x*x` into `x**2` or `x+x` into `2*x`
3. EvaluateVisitor: takes an Equation and a dictionary of variable names and associated values; returns an Equation with all instances of the variables passed replaced, the results restructured. Note that this could yield a simple numeric answer, or it could result in a closure.  

#### Observers
GraphCa would contain a set of observers for generating output. Trivially, there would be the output of the analyze function, which would return an Equation (Formula?). However, the TraverseVisitor should allow for the binding of OutputObserver instances, which could be used to perform an in-order traversal of the given Equation, yielding the value of the current node of the tree to the OutputObserver. This could be used for either evaluating the Equation at a given set of input values, or for generating a textual representation of the tree. Furthermore, a secondary set of observers could be utilized to generate debug output while performing the various analysis stages of tree simplification. These could be piped to Console, or, with a Verbose/Logging option enabled within the app, be output into the Terminal. 

## Front-end
GraphCa would be designed as a React application, primarily written as functional components with hooks. State, itself, would primarily be managed by Redux. This particular combination allows for a single-source of truth for state and efficient rendering, without being overly complicated in design. Each component would be written within its own directory, a la:

```
/components
|-Keypad
||-index.tsx
||-styles.css
||-Button
|||-index.tsx
|||-styles.css
```

This would allow for components to be designed in a modular fashion, as well as allow them to hierarchically contain the components they rely upon. Certain components might be utilized in more than a singular location, so would need to be elevated up the hierarchy. Other components might need extra functionality to back them---such as storyboards or documentation to aid development. Stylesheets would operate on modularity: each component would define its own styles:

```tsx
import styles from `./styles.css`

export function() {
  return <button className=`${styles.keypadButton}`>/<button>
}
```

Application state would look something like the following:

```tsx
state = {
  graphs: [
    {
      name: 'graph-01',
      equations: [
        {
          formula: Equation(),
          values: [
            Vector3(-1,-10,0) // ...
          ]
        }
      ]
      intervals: {
        x: [-1, 1],
        y: [-10, 10],
        z: [0, 0]
      },
      granularity: {
        x: 0.1,
        y: 1,
        z: 0
      },
      lineAlgorithm: 'spline'
    }
  ],
  terminals: [
    {
      name: 'terminal-01',
      currentLine: 'sin(x**)',
      history: [
        {
          type: 'input',
          content: 'x+5'
        },
        {
          type: 'output',
          content: Equation()
        }
      ]
    }
  ],
  activeGraph: 0,
  activeTerminal: 0
}
```