var projectionMatrix;
let mat4 =glMatrix.mat4;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, 
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms
var anglet= 0.0;
var y_transition = 0.0;


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
}

// TO DO: Create the functions for each of the figures.

function createDodecahedron(gl, translation, rotationAxis){
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       //   Bottom Pyramid Face
       -1.2, -1.0,  -0.2,   //0 This vertice conforme Triangle 1
       -0.8, -1.0,  1.0,    //1 This vertice conforme Triangle 1 and Triangle 2
       0.0, -1.0, -1.0,     //2 This vertice conforme Triangle 1, Triangle 2 and Triangle 3
       0.8, -1.0,  1.0,     //3 This vertice conforme Triangle 2 and Triangle 3
       1.2, -1.0,  -0.2,    //4 This vertice conforme Triangle 3

       // Bottom dodecahedron faces
       //   Face2
       -1.2, -1.0,  -0.2,   //5 This vertice conforme Triangle 4 and Triangle 6
       0.0, -1.0, -1.0,     //6 This vertice conforme Triangle 4 and Triangle 5
       -1.0, 1.0, -1.5,     //7 This vertice conforme Triangle 4, Triangle 5 and Triangle 6
       0.0, 0.0, -1.5,      //8 This vertice conforme Triangle 5
       -1.6, 0.0, -0.5,     //9 This vertice conforme Triangle 6

    //      Face3
       0.0, -1.0, -1.0,     //10 This vertice conforme Triangle 7 and Triangle 8
       1.2, -1.0,  -0.2,    //11 This vertice conforme Triangle 7 and Triangle 9
       1.0, 1.0, -1.5,      //12 This vertice conforme Triangle 7, Triangle 8 and Triangle 9
       0.0, 0.0, -1.5,      //13 This vertice conforme Triangle 8
       1.6, 0.0, -0.5,      //14 This vertice conforme Triangle 9

    //      Face4
       1.2, -1.0,  -0.2,    //15 This vertice conforme Triangle 10 and Triangle 11
       0.8, -1.0,  1.0,     //16 This vertice conforme Triangle 10 and Triangle 12
       2.0, 1.0, 0.8,       //17 This vertice conforme Triangle 10, Triangle 11 and Triangle 12
       1.6, 0.0, -0.5,      //18 This vertice conforme Triangle 11
       1.2, 0.0, 1.5,       //19 This vertice conforme Triangle 12

    //      Face5
       -0.8, -1.0, 1.0,     //20 This vertice conforme Triangle 13 and Triangle 15
       0.8, -1.0, 1.0,      //21 This vertice conforme Triangle 13 and Triangle 14
       0.0, 1.0, 2.3,       //22 This vertice conforme Triangle 13, Triangle 14 and Triangle 15
       1.2, 0.0, 1.5,       //23 This vertice conforme Triangle 14
       -1.2, 0.0, 1.6,      //24 This vertice conforme Triangle 15

    //      Face6
       -0.8, -1.0,  1.0,    //25 This vertice conforme Triangle 16 and Triangle 17
       -1.2, -1.0,  -0.2,   //26 This vertice conforme Triangle 16 and Triangle 18
       -2.4, 1.0, 1.0,      //27 This vertice conforme Triangle 16, Triangle 17 and Triangle 18
       -1.6, 0.0, -0.5,     //28 This vertice conforme Triangle 17
       -1.2, 0.0, 1.6,      //29 This vertice conforme Triangle 18

    // Top dodecahedron faces
    //      Face7
       -1.0, 1.0, -1.5,     //30 This vertice conforme Triangle 19 and Triangle 20
       1.0, 1.0, -1.5,      //31 This vertice conforme Triangle 19, Triangle 20 and Triangle 21
       0.0, 0.0, -1.5,      //32 This vertice conforme Triangle 19
       -1.2, 2.3, -1.0,     //33 This vertice conforme Triangle 20 and Triangle 21
       0.5, 2.3, -1.0,      //34 This vertice conforme Triangle 21

    //      Face8  
       1.0, 1.0, -1.5,      //35 This vertice conforme Triangle 22 and Triangle 23
       2.0, 1.0, 0.8,       //36 This vertice conforme Triangle 22, Triangle 23 and Triangle 24
       1.6, 0.0, -0.5,      //37 This vertice conforme Triangle 22
       0.5, 2.3, -1.0,      //38 This vertice conforme Triangle 23 and Triangle 24
       1.5, 2.3, 0.0,       //39 This vertice conforme Triangle 24

    //      Face9
       2.0, 1.0, 0.8,       //40 This vertice conforme Triangle 25 and Triangle 26
       0.0, 1.0, 2.3,       //41 This vertice conforme Triangle 25, Triangle 26 and Triangle 27
       1.2, 0.0, 1.5,       //42 This vertice conforme Triangle 25
       1.5, 2.3, 0.0,       //43 This vertice conforme Triangle 26 and Triangle 27
       -0.1, 2.3, 1.5,      //44 This vertice conforme Triangle 27

    //    // Face10
        0.0, 1.0, 2.3,      //45 This vertice conforme Triangle 28 and Triangle 29
        -2.4, 1.0, 1.0,     //46 This vertice conforme Triangle 28, Triangle 29 and Triangle 30
        -1.2, 0.0, 1.6,     //47 This vertice conforme Triangle 28
        -0.1, 2.3, 1.5,     //48 This vertice conforme Triangle 29 and Triangle 30
        -1.8, 2.3, 0.6,     //49 This vertice conforme Triangle 30

    //      Face11
        -1.0, 1.0, -1.5,    //50 This vertice conforme Triangle 31, Triangle 32 and Triangle 33
        -2.4, 1.0, 1.0,     //51 This vertice conforme Triangle 31 and Triangle 32
        -1.6, 0.0, -0.5,    //52 This vertice conforme Triangle 31
        -1.8, 2.3, 0.6,     //53 This vertice conforme Triangle 32 and Triangle 33
        -1.2, 2.3, -1.0,    //54 This vertice conforme Triangle 33

    //      Face12
    
        0.5, 2.3, -1.0, 
        1.5, 2.3, 0.0, 
        -0.1, 2.3, 1.5,
        -1.2, 2.3, -1.0,
        -1.8, 2.3, 0.6,

    ];
    var dV = verts.length / 3;   

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0], // Left face
        [1.0, 0.0, 0.5, 1.0], // Bottom face
        [1.0, 0.5, 0.5, 1.0],
        [0.5, 0.5, 0.1, 0.5],
        [0.5, 0.0, 0.5, 0.5],
        [1.0, 0.0, 0.0, 0.5],
        [1.0, 1.0, 1.0, 0.5],
        [1.5, 0.0, 0.5, 0.0],
        [0.5, 0.5, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0]
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    var dC = vertexColors.length;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodecahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecahedronIndexBuffer);

    let dodecahedronIndices = [
        0, 1, 2,    1, 2, 3,    2, 3, 4,    // Bottom dodecahedron faces Triangles 1, 2 and 3
        5, 6, 7,    6, 7, 8,    5, 7, 9,    // Triangles 4, 5 and 6
        10,11,12,   10,12,13,   11,12,14,   // Triangles 7, 8 and 9
        15,16,17,   15,17,18,   16,17,19,   // Triangles 10, 11 and 12
        20,21,22,   21,22,23,   20,22,24,   // Triangles 13, 14 and 15
        25,26,27,   26,27,28,   25,27,29,   // Triangles 16, 17 and 18

        30,31,32,   30,31,33,   31,33,34,    // Top dodecahedron faces Triangles 19, 20, 21
        35,36,37,   35,36,38,   36,38,39,   
        40,41,42,   40,41,43,   41,43,44,
        45,46,47,   45,46,48,   46,48,49,
        50,51,52,   50,51,53,   50,53,54,
        55,56,57,   55,57,58,   57,58,59
        
    ];

    var dI = dodecahedronIndices.length;

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecahedronIndices), gl.STATIC_DRAW);
    
    let dodecahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:dodecahedronIndexBuffer,
            vertSize:3, nVerts:dV, colorSize:4, nColors: dC, nIndices:dI,
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


function createOctahedron(gl, rotationAxis){
    // Vertex Data
    

    
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       // Bottom face
       -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,

       // Face1
       -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       0.0, 0.5, 0.0,

       // Face2
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
       0.0, 0.5, 0.0,

       // Face3
       1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,
       0.0, 0.5, 0.0,

       // Face4
       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       0.0, 0.5, 0.0,

       // Face5
       -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       0.0, -2.5, 0.0,

       // Face6
       1.0, -1.0, -1.0,
       1.0, -1.0,  1.0,
       0.0, -2.5, 0.0,

       // Face7
       1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,
       0.0, -2.5, 0.0,

       // Face8
       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       0.0, -2.5, 0.0

    ];
    
        
    let oV = verts.length / 3;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.DYNAMIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 0.5], // Back face
        [0.0, 0.0, 1.0, 0.5], // Top face
        [1.0, 1.0, 0.0, 0.5], // Bottom face
        [1.0, 0.0, 1.0, 0.5], // Right face
        [0.0, 1.0, 1.0, 0.5],  // Left face
        [0.0, 0.0, 1.0, 0.5], // Top face
        [1.0, 1.0, 0.0, 0.5], // Bottom face
        [1.0, 0.0, 1.0, 0.5], // Right face
        [0.0, 1.0, 1.0, 0.5]  // Left face
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    let oC = vertexColors.length;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let octahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octahedronIndexBuffer);

    let octahedronIndices = [
        0, 1, 2,      0, 2, 3,    // Middle face
        4, 5, 6,
        7, 8, 9,
        10, 11, 12,
        13, 14, 15,

        16, 17, 18,
        19, 20, 21,
        22, 23, 24,
        25, 26, 27
    ];

    let oI = octahedronIndices.length;

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);
    
    let octahedron = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:octahedronIndexBuffer,
            vertSize:3, nVerts:oV, colorSize:4, nColors: oC, nIndices:oI,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    

    // mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, [5,y_transition,-18]);
    

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
        y_transition = Math.sin(anglet) * 5;
        
        
        // mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        mat4.fromTranslation(this.modelViewMatrix, [5, y_transition, -18]); 
        anglet+=0.005;
    };
    
    return octahedron;
}

function createPyramid(gl, translation, rotationAxis){
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        // Bottom Pyramid Face
        -1.2, -1.0,  -0.2, // Left Triangle 
        -0.8, -1.0,  1.0,  // 
        0.0, -1.0, -1.0,   //
        0.8, -1.0,  1.0,   //
        1.2, -1.0,  -0.2,  // Right Triangle

        // Face1
        -1.2, -1.0,  -0.2, 
        -0.8, -1.0,  1.0,  
        0.0, 2, 0,

        // Face2
        -1.2, -1.0,  -0.2, 
        0.0, -1.0, -1.0,   
        0.0, 2, 0,
 
        // Face3
        -0.8, -1.0,  1.0,  
        0.8, -1.0,  1.0,   
        0.0, 2, 0,
 
        // Face4
        0.8, -1.0,  1.0,  
        1.2, -1.0,  -0.2,
        0.0, 2, 0,
 
        // Face5
        1.2, -1.0,  -0.2,
        0.0, -1.0, -1.0, 
        0.0, 2, 0
    ];
    
    var nV = verts.length / 3;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], // Front face
        [0.0, 1.0, 0.0, 1.0], // Back face
        [0.0, 0.0, 1.0, 1.0], // Top face
        [1.0, 1.0, 0.0, 1.0], // Bottom face
        [1.0, 0.0, 1.0, 1.0], // Right face
        [0.0, 1.0, 1.0, 1.0]  // Left face
    ];


    let vertexColors = [];
    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    var nC = vertexColors.length;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let pyramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBuffer);

    let pyramidIndices = [
        0, 1, 2,       1, 2, 3,    2, 3, 4, // Bottom Pyramid face
        5, 6, 7,                            // Face1
        8, 9, 10,                           // Face2
        11, 12, 13,                         // Face3
        14, 15, 16,                         // Face4
        17, 18, 19                          // Face5
    ];

    var pI = pyramidIndices.length;

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    
    let pyramid = {
            buffer:vertexBuffer, colorBuffer:colorBuffer, indices:pyramidIndexBuffer,
            vertSize:3, nVerts:nV, colorSize:4, nColors: nC, nIndices:pI,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
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
    
    return pyramid;
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
    requestAnimationFrame(function() { 
        run(gl, objs); 
        
    });
    draw(gl, objs);

    for(i = 0; i<objs.length; i++){
        objs[i].update();
        // console.log(y_transition);
    }
        
}