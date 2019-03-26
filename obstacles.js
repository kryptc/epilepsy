// / <reference path="webgl.d.ts" />

let train = class {
    constructor(gl, pos) {
        this.move = 0;
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [
             // Front face
             -1.0, -1.0, 4.5,
             1.0, -1.0, 4.5,
             1.0, 1.6, 4.5,
             -1.0, 1.6, 4.5,
             //Back Face
             -1.0, -1.0, -4.5,
             1.0, -1.0, -4.5,
             1.0, 1.6, -4.5,
             -1.0, 1.6, -4.5,
             //Top Face
             -1.0, 1.6, -4.5,
             1.0, 1.6, -4.5,
             1.0, 1.6, 4.5,
             -1.0, 1.6, 4.5,
             //Bottom Face
             -1.0, -1.0, -4.5,
             1.0, -1.0, -1.0,
             1.0, -1.0, 4.5,
             -1.0, -1.0, 4.5,
             //Left Face
             -1.0, -1.0, -4.5,
             -1.0, 1.6, -4.5,
             -1.0, 1.6, 4.5,
             -1.0, -1.0, 4.5,
             //Right Face
             1.0, -1.0, -4.5,
             1.0, 1.6, -4.5,
             1.0, 1.6, 4.5,
             1.0, -1.0, 4.5,
        ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        this.faceColors = [
            // [255/255, 14/255, 4/255, 1.0],
            // [255/255, 14/255, 4/255, 1.0],
            // [255/255, 12/255, 2/255, 1.0],
            // [255/255, 12/255, 2/255, 1.0],
            // [255/255, 14/255, 4/255, 1.0],
            // [255/255, 14/255, 4/255, 1.0],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],

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
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23 
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
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    def_bounding_box()
    {
        var bb = {
        x : this.pos[0],
        y : this.pos[1],
        z : this.pos[2],
        wd : 0.75,
        ht : 2.6,
        depth : 9.0, };
        return bb;
    }
};


// / <reference path="webgl.d.ts" />

let block = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [
             // Front face
             -1.0, -0.4, 0.4,
             1.0, -0.4, 0.4,
             1.0, 0.9, 0.4,
             -1.0, 0.9, 0.4,
             //Back Face
             -1.0, -0.4, -0.2,
             1.0, -0.4, -0.2,
             1.0, 0.9, -0.2,
             -1.0, 0.9, -0.2,
             //Top Face
             -1.0, 0.9, -0.2,
             1.0, 0.9, -0.2,
             1.0, 0.9, 0.4,
             -1.0, 0.9, 0.4,
             //Bottom Face
             -1.0, -0.4, -0.2,
             1.0, -0.4, -0.2,
             1.0, -0.4, 0.4,
             -1.0, -0.4, 0.4,
             //Left Face
             -1.0, -0.4, -0.2,
             -1.0, 0.9, -0.2,
             -1.0, 0.9, 0.4,
             -1.0, -0.4, 0.4,
             //Right Face
             1.0, -0.4, -0.2,
             1.0, 0.9, -0.2,
             1.0, 0.9, 0.4,
             1.0, -0.4, 0.4,
        ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        this.faceColors = [
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            // [ 0.0/255.0, 135/255.0, 54.0/255.0, 1.0],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],


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
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23 
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
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
    def_bounding_box()
    {
        var bb = {
        x : this.pos[0],
        y : this.pos[1],
        z : this.pos[2],
        wd : 0.75,
        ht : 1.3,
        depth : 0.6, };
        return bb;
    }
};

let bush = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [
       // Front face
             -1.5,-0.75, 0.4,
             1.5,-0.75, 0.4,
             1.5,0.75, 0.4,
             -1.5,0.75, 0.4,
             //Back Face
             -1.5,-0.75, -0.4,
             1.5,-0.75, -0.4,
             1.5,0.75, -0.4,
             -1.5,0.75, -0.4,
             //Top Face
             -1.5,0.75, -0.4,
             1.5,0.75, -0.4,
             1.5,0.75, 0.4,
             -1.5,0.75, 0.4,
             //Bottom Face
             -1.5,-0.75, -0.4,
             1.5,-0.75, -0.4,
             1.5,-0.75, 0.4,
             -1.5,-0.75, 0.4,
             //Left Face
             -1.5,-0.75, -0.4,
             -1.5,0.75, -0.4,
             -1.5,0.75, 0.4,
             -1.5,-0.75, 0.4,
             //Right Face
             1.5,-0.75, -0.4,
             1.5,0.75, -0.4,
             1.5,0.75, 0.4,
             1.5,-0.75, 0.4,
        ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        // Texture buffer

        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                        gl.STATIC_DRAW);

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
            8, 9, 10,   8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23 
        ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            // color: colorBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }

    }

    draw(gl, projectionMatrix, programInfo, deltaTime, texture) {

        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);
        // this.rotation += deltaTime

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

        // Tell WebGL how to pull out the texture from the texture buffer
        // into the vertexColor attribute.
        {
            const numComponents = 2;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(
                programInfo.attribLocations.textureCoord,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.textureCoord);
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

          // Specify the texture to map onto the faces.

        // Tell WebGL we want to affect texture unit 0
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    def_bounding_box()
    {
        var bb = {
        x : this.pos[0],
        y : this.pos[1],
        z : this.pos[2],
        wd : 3.0,
        ht : 1.5,
        depth : 0.8, };
        return bb;
    }
};



