"use strict";

class Render {

    constructor(canvasID) {

        this.canvas = document.getElementById(canvasID);

        try{
            this.gl = this.canvas.getContext("webgl");
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
        catch(e){
            var msg = "Error WebGL: " + e.toString();
            alert(msg);
            throw Error(msg);
        }

        if(!this.gl) {
            console.error("Erro ao iniciar o WebGL.");
            return;
        }

        var vertexShaderSource = document.getElementById("meu-vertex-shader").text;
        var fragmentShaderSource = document.getElementById("meu-fragment-shader").text;

        var vertexShader = Render.createShader(this.gl, this.gl.VERTEX_SHADER, vertexShaderSource);
        var fragmentShader = Render.createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.programa = Render.createProgram(this.gl, vertexShader, fragmentShader);

        this.positionAttributeLocation = this.gl.getAttribLocation(this.programa, "posicao");
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        this.gl.useProgram(this.programa);
        this.matrixLocation = this.gl.getUniformLocation(this.programa, "u_escala");
        this.matriz = [this.canvas.height / this.canvas.width, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    }   

    draw() {
        

        this.gl.uniformMatrix4fv(this.matrixLocation, false, this.matriz);

        var positions = [0, 0, 0, 0, 0.5, 0, 0.5, 0, 0];

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        this.gl.enableVertexAttribArray(this.positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

        var size = 3;
        var type = this.gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        this.gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

        var primitiveType = this.gl.TRIANGLES;
        var offset = 0;
        var count = 3;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    static createShader(gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

        if(success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    static createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        
        if(success){
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}   