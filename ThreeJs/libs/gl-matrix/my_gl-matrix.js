/* Mat4 class implementation */
class Mat4{    
    /* Helper function for returning a 4*4 identity matrix */
    static create(){
        let identityMatrix = new Array(16);
        identityMatrix[1] = 0;
        identityMatrix[2] = 0;
        identityMatrix[3] = 0;
        identityMatrix[4] = 0;
        identityMatrix[6] = 0;
        identityMatrix[7] = 0;
        identityMatrix[8] = 0;
        identityMatrix[9] = 0;
        identityMatrix[11] = 0;
        identityMatrix[12] = 0;
        identityMatrix[13] = 0;
        identityMatrix[14] = 0;
        // Now, 1's
        identityMatrix[0] = 1;
        identityMatrix[5] = 1;
        identityMatrix[10] = 1;
        identityMatrix[15] = 1;

        return identityMatrix;
    }
    
    /* Helper function for resetting a matrix to a 4*4 identity matrix */
    static identity(matrix){
        matrix[1] = 0;
        matrix[2] = 0;
        matrix[3] = 0;
        matrix[4] = 0;
        matrix[6] = 0;
        matrix[7] = 0;
        matrix[8] = 0;
        matrix[9] = 0;
        matrix[11] = 0;
        matrix[12] = 0;
        matrix[13] = 0;
        matrix[14] = 0;
        // Now, 1's
        matrix[0] = 1;
        matrix[5] = 1;
        matrix[10] = 1;
        matrix[15] = 1;

        return matrix;
    } 

    /* Function for rotating in X, receives matrix, angle and outMatrix. Result is outMatrix */
    static rotateInX(outMatrix,matrix,angle){
        if(matrix !== outMatrix){
            outMatrix[0] = matrix[0];
            outMatrix[1] = matrix[1];
            outMatrix[2] = matrix[2];
            outMatrix[3] = matrix[3];
            outMatrix[12] = matrix[12];
            outMatrix[13] = matrix[13];
            outMatrix[14] = matrix[14];
            outMatrix[15] = matrix[15];
        }

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        outMatrix[4] = (matrix[4] * cos) + (matrix[8] * sin);
        outMatrix[5] = (matrix[5] * cos) + (matrix[9] * sin);
        outMatrix[6] = (matrix[6] * cos) + (matrix[10] * sin);
        outMatrix[7] = (matrix[7] * cos) + (matrix[11] * sin);

        outMatrix[8] = (matrix[8] * cos) - (matrix[4] * sin);
        outMatrix[9] = (matrix[9] * cos) - (matrix[5] * sin);
        outMatrix[10] = (matrix[10] * cos) - (matrix[6] * sin);
        outMatrix[11] = (matrix[11] * cos) - (matrix[7] * sin);
        
        return outMatrix;

    }

    /* Function for rotating in Y, receives matrix, angle and outMatrix. Result is outMatrix */
    static rotateInY(outMatrix,matrix,angle){
        if(matrix !== outMatrix){
            outMatrix[4] = matrix[4];
            outMatrix[5] = matrix[5];
            outMatrix[6] = matrix[6];
            outMatrix[7] = matrix[7];
            outMatrix[12] = matrix[12];
            outMatrix[13] = matrix[13];
            outMatrix[14] = matrix[14];
            outMatrix[15] = matrix[15];
        }

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        outMatrix[0] = (matrix[0] * cos) - (matrix[8] * sin);
        outMatrix[1] = (matrix[1] * cos) - (matrix[9] * sin);
        outMatrix[2] = (matrix[2] * cos) - (matrix[10] * sin);
        outMatrix[3] = (matrix[3] * cos) - (matrix[11] * sin);

        outMatrix[8] = (matrix[0] * sin) - (matrix[8] * cos);
        outMatrix[9] = (matrix[1] * sin) - (matrix[9] * cos);
        outMatrix[10] = (matrix[2] * sin) - (matrix[10] * cos);
        outMatrix[11] = (matrix[3] * sin) - (matrix[11] * cos);

        return outMatrix;
    }

    /* Function for rotating in Z, receives matrix, angle and outMatrix. Result is outMatrix */
    static rotateInZ(outMatrix, matrix,angle){
        if(matrix !== outMatrix){
            outMatrix[8] = matrix[8];
            outMatrix[9] = matrix[9];
            outMatrix[10] = matrix[10];
            outMatrix[11] = matrix[11];
            outMatrix[12] = matrix[12];
            outMatrix[13] = matrix[13];
            outMatrix[14] = matrix[14];
            outMatrix[15] = matrix[15];
        }

        let cos = Math.cos(angle);
        let sin = Math.sin(angle);

        outMatrix[0] = (matrix[0] * cos) + (matrix[4] * sin);
        outMatrix[1] = (matrix[1] * cos) + (matrix[5] * sin);
        outMatrix[2] = (matrix[2] * cos) + (matrix[6] * sin);
        outMatrix[3] = (matrix[3] * cos) + (matrix[7] * sin);
        outMatrix[4] = (matrix[4] * cos) - (matrix[0] * sin);
        outMatrix[5] = (matrix[5] * cos) - (matrix[1] * sin);
        outMatrix[6] = (matrix[6] * cos) - (matrix[2] * sin);
        outMatrix[7] = (matrix[7] * cos) - (matrix[3] * sin);

        return out;

    }

    /* Function for translating. It receives matrix, a vector and outMatrix. Result is outMatrix */
    static translate(outMatrix,matrix,vector){
        outMatrix[0] = matrix[0];
        outMatrix[1] = matrix[1];
        outMatrix[2] = matrix[2];
        outMatrix[3] = matrix[3];
        outMatrix[4] = matrix[4];
        outMatrix[5] = matrix[5];
        outMatrix[6] = matrix[6];
        outMatrix[7] = matrix[7];
        outMatrix[8] = matrix[8];
        outMatrix[9] = matrix[9];
        outMatrix[10] = matrix[10];
        outMatrix[11] = matrix[11];
        outMatrix[12] = matrix[0] * vector[0] + matrix[4] * vector[1] + matrix[8] * vector[2] + matrix[12];
        outMatrix[13] = matrix[1] * vector[0] + matrix[5] * vector[1] + matrix[9] * vector[2] + matrix[13];
        outMatrix[14] = matrix[2] * vector[0] + matrix[6] * vector[1] + matrix[10] * vector[2] + matrix[14];
        outMatrix[15] = matrix[3] * vector[0] + matrix[7] * vector[1] + matrix[11] * vector[2] + matrix[15];

        return outMatrix;

    }

    /* Function for setting the perspecive. It recieves outMatrix, a field of view, aspect, near and far. Result is outMatrix */
    static perspective(outMatrix, fieldOfViewInRadians, aspect, near, far){
        let f = Math.tan(Math.PI * 0.5 -0.5 * fieldOfViewInRadians);
        let rangeInv = 1.0 / (near - far);

        outMatrix[0] = f / aspect;
        outMatrix[1] = 0;
        outMatrix[2] = 0;
        outMatrix[3] = 0;
        outMatrix[4] = 0;
        outMatrix[5] = f;
        outMatrix[6] = 0;
        outMatrix[7] = 0;
        outMatrix[8] = 0;
        outMatrix[9] = 0;
        outMatrix[10] = (near + far) * rangeInv;
        outMatrix[11] = -1;
        outMatrix[12] = 0;
        outMatrix[13] = 0;
        outMatrix[14] = (near + far) * rangeInv * 2;
        outMatrix[15] = 0;

        return outMatrix;
    }
    
}
