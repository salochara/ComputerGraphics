let mat4 = glMatrix.mat4;

var projectionMatrix;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute,
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
var vertexShaderSource =
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
var fragmentShaderSource =
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    var gl = null;
    var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try
    {
        gl = canvas.getContext("experimental-webgl");
    }
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Function for creating pyramid
function createPyramid(gl, translation, rotationAxis)
{
    // Vertex Data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    var verts = [
      // Base
      0.0, 1.0,  1.0,
      2 * (0.5), 2 * (0.15),  1.0,
      2 * (0.30), 2 * (-0.50), 1.0,
      2 * (-0.30), 2 * (-0.50), 1.0,
      2 * (-0.5), 2 * (0.15),  1.0,
      0.0, 1.0,  1.0,
      2 * (0.30), 2 * (-0.50), 1.0,
      0.0, 1.0,  1.0,
      2 * (-0.30), 2 * (-0.50), 1.0,
      // Wall 1
      0.0, 1.0,  1.0,
      2 * (0.5), 2 * (0.15),  1.0,
      0.0, 0.0,  2.5,
      // 2
      2 * (0.5), 2 * (0.15),  1.0,
      2 * (0.30), 2 * (-0.50), 1.0,
      0.0, 0.0,  2.5,
      // 3
      2 * (0.30), 2 * (-0.50), 1.0,
      2 * (-0.30), 2 * (-0.50), 1.0,
      0.0, 0.0,  2.5,
      // 4
      2 * (-0.30), 2 * (-0.50), 1.0,
      2 * (-0.5), 2 * (0.15),  1.0,
      0.0, 0.0,  2.5,
      // 5
      2 * (-0.5), 2 * (0.15),  1.0,
      0.0, 1.0,  1.0,
      0.0, 0.0,  2.5,
     ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [];

    for (var i = 0; i < 6; i++) {
      faceColors.push([Math.random(), Math.random(), Math.random(), 1.0]);
    }

    var vertexColors = [];
     for (var i in faceColors)
     {
         var color = faceColors[i];
         for (var j=0; j < 4; j++)
             vertexColors = vertexColors.concat(color);
     }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    var pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);
    var pyramidIndices = [
        0,1,2, 3,4,5, 6,7,8, // Base
        9,10,11, // Wall 1
        12,13,14, // Wall 2
        15,16,17, // Wall 3
        18,19,20, // Wall 4
        21,22,23 // Wall 5
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);

    var pyramid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors:24 , nIndices: pyramidIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };

    return pyramid;
}

function createOctahedron(gl, translation, rotationAxis)
{
    var speed= 0.0;    
    // Vertex Data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let y_move = 0.0;

    var verts = [
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      -1.0, 1.0,  1.0,
      1.0, 1.0,  1.0,

      0.0, 0.0, 2.0,
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,

      0.0, 0.0, 2.0,
      1.0, -1.0,  1.0,
      1.0, 1.0,  1.0,

      0.0, 0.0, 2.0,
      1.0, 1.0,  1.0,
      -1.0, 1.0,  1.0,

      0.0, 0.0, 2.0,
      -1.0, 1.0,  1.0,
      -1.0, -1.0,  1.0,

      0.0, 0.0, 0,
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,

      0.0, 0.0, 0,
      1.0, -1.0,  1.0,
      1.0, 1.0,  1.0,

      0.0, 0.0, 0,
      1.0, 1.0,  1.0,
      -1.0, 1.0,  1.0,

      0.0, 0.0, 0,
      -1.0, 1.0,  1.0,
      -1.0, -1.0,  1.0,

     ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [];

    for (var i = 0; i < 10; i++) {
      faceColors.push([Math.random(), Math.random(), Math.random(), 1.0]);
    }

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    var vertexColors = [];
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    var octahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octahedronIndexBuffer);
    var octahedronIndices = [
      0,1,2, 1,2,3, // Middle Square
      4,5,6,
      7,8,9,
      10,11,12,
      13,14,15,
      16,17,18,
      19,20,21,
      22,23,24,
      25,26,27
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);

    let octahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:octahedronIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors:25 , nIndices: octahedronIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};


    octahedron.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;    
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        y_move = Math.sin(speed) * 8;
        // mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.fromTranslation(this.modelViewMatrix, [5, y_move, -18]); 
        speed+=0.003;
    };

    return octahedron;
}

function createDodecahedron(gl, translation, rotationAxis)
{
     // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       -1.2, -1.0,  -0.2,   
       -0.8, -1.0,  1.0,    
       0.0, -1.0, -1.0,     
       0.8, -1.0,  1.0,     
       1.2, -1.0,  -0.2,   
       //   Face2
       -1.2, -1.0,  -0.2,   
       0.0, -1.0, -1.0,     
       -1.0, 1.0, -1.5,     
       0.0, 0.0, -1.5,      
       -1.6, 0.0, -0.5,    
    //      Face3
       0.0, -1.0, -1.0,     
       1.2, -1.0,  -0.2,    
       1.0, 1.0, -1.5,      
       0.0, 0.0, -1.5,     
       1.6, 0.0, -0.5,      
    //      Face4
       1.2, -1.0,  -0.2,    
       0.8, -1.0,  1.0,    
       2.0, 1.0, 0.8,       
       1.6, 0.0, -0.5,      
       1.2, 0.0, 1.5,       
    //      Face5
       -0.8, -1.0, 1.0,     
       0.8, -1.0, 1.0,      
       0.0, 1.0, 2.3,       
       1.2, 0.0, 1.5,       
       -1.2, 0.0, 1.6,      
    //      Face6
       -0.8, -1.0,  1.0,    
       -1.2, -1.0,  -0.2,   
       -2.4, 1.0, 1.0,      
       -1.6, 0.0, -0.5,     
       -1.2, 0.0, 1.6,      
    //      Face7
       -1.0, 1.0, -1.5,     
       1.0, 1.0, -1.5,      
       0.0, 0.0, -1.5,      
       -1.2, 2.3, -1.0,     
       0.5, 2.3, -1.0,      
    //      Face8  
       1.0, 1.0, -1.5,     
       2.0, 1.0, 0.8,       
       1.6, 0.0, -0.5,      
       0.5, 2.3, -1.0,      
       1.5, 2.3, 0.0,       
    //      Face9
       2.0, 1.0, 0.8,       
       0.0, 1.0, 2.3,       
       1.2, 0.0, 1.5,       
       1.5, 2.3, 0.0,       
       -0.1, 2.3, 1.5,      
    //    // Face10
        0.0, 1.0, 2.3,      
        -2.4, 1.0, 1.0,     
        -1.2, 0.0, 1.6,     
        -0.1, 2.3, 1.5,     
        -1.8, 2.3, 0.6,         
    //      Face11
        -1.0, 1.0, -1.5,    
        -2.4, 1.0, 1.0,     
        -1.6, 0.0, -0.5,    
        -1.8, 2.3, 0.6,     
        -1.2, 2.3, -1.0,    
    //      Face12
        0.5, 2.3, -1.0, 
        1.5, 2.3, 0.0, 
        -0.1, 2.3, 1.5,
        -1.2, 2.3, -1.0,
        -1.8, 2.3, 0.6,
    ];
    

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    
    let faceColors = [];
    
    for (var i = 0; i < 16; i++) {
      faceColors.push([Math.random(), Math.random(), Math.random(), 1.0]);
    }
    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodecahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecahedronIndexBuffer);

    let dodecahedronIndices = [
        0, 1, 2,    1, 2, 3,    2, 3, 4,    
        5, 6, 7,    6, 7, 8,    5, 7, 9,    
        10,11,12,   10,12,13,   11,12,14,  
        15,16,17,   15,17,18,   16,17,19,   
        20, 21,22,   21,22,23,   20,22,24,   
        25,26,27,   26,27,28,   25,27,29,   
        30,31,32,   30,31,33,   31,33,34,    
        35,36,37,   35,36,38,   36,38,39,   
        40,41,42,   40,41,43,   41,43,44,
         45,46,47,   45,46,48,   46,48,49,
        50,51,52,   50,51,53,   50,53,54,
        55,56,57,   55,57,58,   57,58,59
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecahedronIndices), gl.STATIC_DRAW);
    
    let dodecahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:dodecahedronIndexBuffer,
            vertSize:3, nVerts:verts.length / 3, colorSize:4, nColors: vertexColors.length, nIndices: dodecahedronIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

    dodecahedron.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return dodecahedron;

}

function createShader(gl, str, type)
{
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs)
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i<objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs)
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });
    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}
