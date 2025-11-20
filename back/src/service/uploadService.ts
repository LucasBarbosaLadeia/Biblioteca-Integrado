import path from 'path'; 

import multer from 'multer'; 

import fs from 'fs'; 

import { Request } from 'express'; 

 

 

interface MulterFile { 

    fieldname: string; 

    originalname: string; 

    encoding: string; 

    mimetype: string; 

    size?: number; 

    destination?: string; 

    filename?: string; 

    path?: string; 

    buffer?: Buffer; 

    [key: string]: any; 

} 

 

const createUploadDirectory = (dir: string): void => { 

    if (!fs.existsSync(dir)) { 

        fs.mkdirSync(dir, { recursive: true }); 

        console.log(`Diretório ${dir} criado automaticamente.`); 

    } 

}; 

 

const fileFilter = ( 

    req: Request, 

    file: MulterFile, 

    cb: (error: Error | null, acceptFile?: boolean) => void 

): void => { 

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') { 

        cb(null, true); 

    } else { 

        cb(new Error('Tipo de arquivo inválido. Apenas JPG e PNG são permitidos.'), false); 

    } 

}; 

 

const MAX_FILE_SIZE = 5 * 1024 * 1024; 

 

const storage = multer.diskStorage({ 

        destination: ( 

            req: Request, 

            file: MulterFile, 

            cb: (error: Error | null, destination?: string) => void 

        ) => { 

        const uploadDiretorio = 'uploads/'; 

        createUploadDirectory(uploadDiretorio); 

        cb(null, uploadDiretorio); 

    }, 

        filename: ( 

            req: Request, 

            file: MulterFile, 

            cb: (error: Error | null, filename?: string) => void 

        ) => { 

        cb(null, `${Date.now()}${path.extname(file.originalname)}`); 

    }, 

}); 

 

const upload = multer({ 

    storage, 

    fileFilter, 

    limits: { 

        fileSize: MAX_FILE_SIZE, 

        files: 1, 

    }, 

}); 

 

export default upload; 

 