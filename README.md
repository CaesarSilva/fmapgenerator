# fmapgenerator

It can indirectly generate a soldat map using a mathematical function.
  It works by generating a XML file that can be inserted into .polywonks file, then the user can use Polywonks to add the flag and player spawns, perhaps some extra polygons and then compile it.
  
   I think the code is full of typos and things that doesnt make any sense.
    Part of the code is not used.
    
    In order to transform a mathematical function into a bunch of triangles i first had to figure out how to plot a graph using a limited ammount of points.
     I first found the vertices, using the derivative function of the main function. In order to make the graph as smooth as possible, i had to find where to put the points.
      Some parts of the graph are "almost" like straight lines, and other parts have curves that cannot be ignored. I found out that the parts of the graph that looked like a straight line were the parts the derivative of the derivative of the main function approached 0.
       So what i did was to create a function to integrate the modulus of the derivative of the derivative of the main function(that was a bit unnecessary but it was just simpler)
       
        So between the vertices of the main function, i would calculate the definite integral of the modulus of the derivative of the derivative of the main function, i would divide it by the ammount of extra vertices i would add between the vertices of the main function.
         Then using a for statement, I would divide the space between the vertices of the main function in 100 parts, and test if the integral between the latest vertex and the current y cordinate matches with the result of the division i did before.
          If it does, i would set this y cordinate as the new vertex and use it to calculate the integral that will be used to find the next vertex.
          
         It depends on canvas to create the png files that can be used to preview the map and the functions.
         
          I hope my explanation was understandable, there are many vertices and it can be confusing.
