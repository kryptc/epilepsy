// / <reference path="webgl.d.ts" />

let road = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [
             
             //Top Face
             -0.8, 0.05, 5000.25,
             0.8, 0.05, 5000.25,
             0.8, 0.05, -5.25,
             -0.8, 0.05, -5.25,
             // //Bottom Face
             // -0.8, -0.05, 5000.25,
             // 0.8, -0.05, 5000.25,
             // 0.8, -0.05, -5.25,
             // -0.8, -0.05, -5.25,

             //stripes
             -0.1, 0.06, 5000.25,
             0.1, 0.06, 5000.25,
             0.1, 0.06, -5.25,
             -0.1, 0.06, -5.25,
             // //Bottom Face
             // -0.1, -0.05, 5000.25,
             // 0.1, -0.05, 5000.25,
             // 0.1, -0.05, -5.25,
             // -0.1, -0.05, -5.25,
        
             // //ground
             // -3, -0.05, 5000.25,
             // 3, -0.05, 5000.25,
             // 3, -0.05, -5.25,
             // -3, -0.05, -5.25,
        ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        this.faceColors = [
            [ 31/255, 43/255, 38/255, 1.0], // Left face: purple
            // [ 31/255, 43/255, 38/255, 1.0], // Left face: purple
            // [ 31/255, 43/255, 38/255, 1.0], // Left face: purple
            // [ 31/255, 43/255, 38/255, 1.0], // Left face: purple
            // [ 132.0/255.0, 21.0/255.0, 50.0/255.0, 1.0], // Left face: purple
            // [ 132.0/255.0, 21.0/255.0, 50.0/255.0, 1.0], // Left face: purple
            // [1,1,1,1],
            [1,1,1,1],

            // [ 198/255, 156/255, 95/255, 1.0],

        ];

        var colors = [];



        for (var j = 0; j < this.faceColors.length; ++j) 
        {
            const c = this.faceColors[j];

            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
            0, 1, 2,    0, 2, 3, // front
            4, 5, 6,    4, 6, 7,
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
        }

    }

    drawCube(gl, projectionMatrix, programInfo, deltaTime) 
    {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 12;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};