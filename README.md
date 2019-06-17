# How to use
`node index.js index.html`  
(only supports inline css properly formatted with a semicolon)

## Files
`renderers.js`: functions that render things to the terminal  
`utils.js`: utility functions  
`index.js`: entrance point


##Supported top level elements
###p
renders text  
css: margin-top, margin-left, margin-bottom, color

###table
renders a table of minimum width.  
css: width, margin-top, margin-bottom

###td in table
by default renders left aligned  
css: text-align

###th in table
by default renders centered  
css: text-align

## Some ways to improve
- Support better nesting of elements. For example, supporting raw text in more elements.
- better css support
